import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { capture } from './exec.ts';
import { getExportNames, listDeclarationFiles } from './starExports.ts';
import type { PublishedPackage } from './starExports.ts';

const IDENTIFIER = /^[A-Za-z_$][\w$]*$/;
const SCOPE = '@shopgate';

/**
 * A published module that has both a JavaScript file and type declarations.
 */
export interface TypedModule {
  /**
   * The specifier a consumer imports the module with, e.g. "@shopgate/engage/core/constants".
   */
  specifier: string;
  /**
   * The names the JavaScript file exports, which the declarations have to provide as well.
   */
  names: string[];
}

/**
 * Collects the published modules with type declarations, together with the names their
 * JavaScript files export.
 * @param packages The published packages.
 * @returns The modules that export at least one name.
 */
export const getTypedModules = (packages: PublishedPackage[]): TypedModule[] => (
  packages
    .filter(pkg => fs.existsSync(pkg.dir))
    .flatMap(pkg => listDeclarationFiles(pkg.dir).flatMap((declaration) => {
      const source = declaration.replace(/\.d\.ts$/, '.js');

      if (!fs.existsSync(source)) {
        return [];
      }

      const modulePath = path.relative(pkg.dir, source)
        .split(path.sep)
        .join('/')
        .replace(/(^|\/)index\.js$/, '')
        .replace(/\.js$/, '');

      return [{
        specifier: modulePath ? `${pkg.name}/${modulePath}` : pkg.name,
        names: getExportNames(source, packages).filter(name => IDENTIFIER.test(name)),
      }];
    }))
    .filter(({ names }) => names.length > 0)
    .sort((a, b) => a.specifier.localeCompare(b.specifier))
);

/**
 * Creates the source of a TypeScript file that reads every exported name of the modules. It
 * doesn't type check when the declarations of a module lack a name.
 * @param modules The modules.
 * @returns The source code.
 */
export const createConsumerSource = (modules: TypedModule[]) => (
  modules.map(({ specifier, names }, index) => [
    `import * as m${index} from '${specifier}';`,
    `export const n${index} = [${names.map(name => `m${index}.${name}`).join(', ')}];`,
  ].join('\n')).join('\n')
);

/**
 * Links or copies the packages a consumer has installed into a "node_modules" folder. The
 * published packages are copied from their builds, since TypeScript treats a linked package like
 * source code of the consumer. Everything else is linked from the repository.
 * @param dir Absolute path of the consumer.
 * @param packages The published packages.
 * @param root The repository root.
 */
const installPackages = (dir: string, packages: PublishedPackage[], root: string) => {
  const source = path.join(root, 'node_modules');
  const target = path.join(dir, 'node_modules');
  const published = new Set(packages.map(({ name }) => name));

  fs.mkdirSync(path.join(target, SCOPE), { recursive: true });

  fs.readdirSync(source, { withFileTypes: true })
    .filter(entry => entry.name !== SCOPE && !entry.name.startsWith('.') && !entry.isFile())
    .forEach((entry) => {
      fs.symlinkSync(path.join(source, entry.name), path.join(target, entry.name), 'junction');
    });

  fs.readdirSync(path.join(source, SCOPE))
    .filter(name => !published.has(`${SCOPE}/${name}`))
    .forEach((name) => {
      fs.symlinkSync(
        fs.realpathSync(path.join(source, SCOPE, name)),
        path.join(target, SCOPE, name),
        'junction'
      );
    });

  packages.forEach((pkg) => {
    fs.cpSync(pkg.dir, path.join(target, pkg.name), { recursive: true });
  });
};

/**
 * Type checks the published packages the way an extension uses them: installed as packages,
 * with the tsconfig that is published for extensions. The check imports every module that has
 * type declarations and reads all names its JavaScript file exports.
 * @param packages The published packages.
 * @param root The repository root.
 * @returns The number of checked modules.
 * @throws When a name isn't provided by the declarations, with the output of the compiler.
 */
export const checkConsumer = (packages: PublishedPackage[], root: string) => {
  const modules = getTypedModules(packages);
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'release-consumer-'));

  try {
    installPackages(dir, packages, root);

    fs.writeFileSync(path.join(dir, 'index.ts'), `${createConsumerSource(modules)}\n`);
    fs.writeFileSync(path.join(dir, 'tsconfig.json'), JSON.stringify({
      extends: `${SCOPE}/engage/tsconfig.extension.json`,
      files: ['index.ts'],
    }));

    const { status, stdout } = capture(
      path.join(root, 'node_modules', '.bin', 'tsc'),
      ['-p', dir, '--pretty', 'false'],
      {
        cwd: dir,
        allowFailure: true,
      }
    );

    if (status !== 0) {
      const errors = stdout
        .split('\n')
        .filter(line => line.includes('error TS'))
        .map((line) => {
          const [, index, message] = /index\.ts\((\d+),\d+\): error (.*)$/.exec(line) ?? [];
          const module = index ? modules[Math.floor((Number(index) - 1) / 2)] : null;

          return module ? `  ${module.specifier}: ${message}` : `  ${line}`;
        });

      throw new Error([
        'The type declarations of the built packages are incomplete for extensions:',
        ...errors,
      ].join('\n'));
    }
  } finally {
    fs.rmSync(dir, {
      recursive: true,
      force: true,
    });
  }

  return modules.length;
};
