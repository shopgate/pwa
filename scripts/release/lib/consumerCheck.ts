import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { capture } from './exec.ts';
import { getModuleExports, listDeclarationFiles } from './starExports.ts';
import type { PublishedPackage } from './starExports.ts';

const IDENTIFIER = /^[A-Za-z_$][\w$]*$/;
const SCOPE = '@shopgate';
const UNTYPED_MODULES = `${SCOPE}/engage/untyped-modules`;
const UNRESOLVED_ERRORS = new Set([
  'TS2304', 'TS2305', 'TS2307', 'TS2503', 'TS2552', 'TS2694', 'TS2724',
]);

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
 * JavaScript files export, including "default" for a default export of their own.
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
      const { names, hasDefault } = getModuleExports(source, packages);

      return [{
        specifier: modulePath ? `${pkg.name}/${modulePath}` : pkg.name,
        names: [
          ...names.filter(name => IDENTIFIER.test(name)),
          ...(hasDefault ? ['default'] : []),
        ],
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
 * Picks the errors of the compiler that the check fails on, in a readable form: a name a
 * module lacks, a name or module in a published declaration that doesn't resolve (with or
 * without a suggestion of a similar name), and errors outside of declaration files. Errors in
 * the declarations of other packages and other errors in the published ones are ignored, since
 * extensions skip the check of declaration files. So is an import of JavaScript without
 * declarations (TS7016), which extensions get as `any` through their fallback for untyped modules.
 * @param output The output of the compiler, run in the consumer folder.
 * @param modules The modules the consumer source reads.
 * @param packages The published packages.
 * @param root The repository root.
 * @returns The errors.
 */
const getConsumerErrors = (
  output: string,
  modules: TypedModule[],
  packages: PublishedPackage[],
  root: string
) => (
  output
    .split('\n')
    .filter(line => line.includes('error TS'))
    .flatMap((line) => {
      const [, index, message] = /^index\.ts\((\d+),\d+\): error (.*)$/.exec(line) ?? [];

      if (index && message.startsWith('TS7016:')) {
        return [];
      }

      if (index) {
        const module = modules[Math.floor((Number(index) - 1) / 2)];

        return [module ? `  ${module.specifier}: ${message}` : `  ${line}`];
      }

      const [, file, position, code, text] = /^(.+\.d\.[cm]?ts)(\(\d+,\d+\)): error (TS\d+): (.*)$/.exec(line) ?? [];

      if (!file) {
        return [`  ${line}`];
      }

      const pkg = packages.find(({ name }) => file.startsWith(`node_modules/${name}/`));
      const declaration = pkg ? file.slice(`node_modules/${pkg.name}/`.length) : '';

      if (!pkg || !UNRESOLVED_ERRORS.has(code) || declaration.includes('node_modules/')) {
        return [];
      }

      const source = path.relative(root, path.join(pkg.dir, declaration)).split(path.sep).join('/');

      return [`  ${source}${position}: ${code}: ${text}`];
    })
);

/**
 * Creates the tsconfig of the consumer: the one that is published for extensions, with the
 * check of declaration files, but without the fallback for untyped modules. Its
 * `declare module '@shopgate/*'` matches every path, so a mistyped path in a declaration would
 * pass.
 * @param dir Absolute path of the consumer.
 * @param packages The published packages.
 * @returns The tsconfig.
 */
const createConsumerConfig = (dir: string, packages: PublishedPackage[]) => {
  const extensionConfig = path.join(dir, 'node_modules', SCOPE, 'engage', 'tsconfig.extension.json');
  const types: unknown = fs.existsSync(extensionConfig)
    ? JSON.parse(fs.readFileSync(extensionConfig, 'utf8')).compilerOptions?.types
    : undefined;

  return {
    extends: `${SCOPE}/engage/tsconfig.extension.json`,
    compilerOptions: {
      skipLibCheck: false,
      ...(Array.isArray(types) ? { types: types.filter(type => type !== UNTYPED_MODULES) } : {}),
    },
    files: ['index.ts'],
    include: packages.map(({ name }) => `node_modules/${name}/**/*.d.ts`),
    exclude: [`node_modules/${UNTYPED_MODULES}.d.ts`],
  };
};

/**
 * Type checks the published packages the way an extension uses them: installed as packages,
 * with the tsconfig that is published for extensions. The check imports every module that has
 * type declarations and reads all names its JavaScript file exports. It also checks the
 * declaration files of the packages for names and modules that don't resolve, which an
 * extension otherwise gets as `any` without an error.
 * @param packages The published packages.
 * @param root The repository root.
 * @returns The number of checked modules.
 * @throws When a name isn't provided by the declarations, a type name doesn't resolve or the
 * compiler fails, with the output of the compiler.
 */
export const checkConsumer = (packages: PublishedPackage[], root: string) => {
  const modules = getTypedModules(packages);
  const dir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'release-consumer-')));

  try {
    installPackages(dir, packages, root);

    fs.writeFileSync(path.join(dir, 'index.ts'), `${createConsumerSource(modules)}\n`);
    fs.writeFileSync(path.join(dir, 'tsconfig.json'), JSON.stringify(createConsumerConfig(dir, packages)));

    const { status, stdout, stderr } = capture(
      path.join(root, 'node_modules', '.bin', 'tsc'),
      ['-p', dir, '--pretty', 'false'],
      {
        cwd: dir,
        allowFailure: true,
      }
    );

    const output = [stdout, stderr].join('\n').trim();
    const errors = status !== 0 && !stdout.includes('error TS')
      ? [`  tsc exited with status ${status}: ${output}`]
      : getConsumerErrors(stdout, modules, packages, root);

    if (errors.length > 0) {
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
