import fs from 'node:fs';
import path from 'node:path';
import {
  PUBLISHABLE_PACKAGES, ROOT, getPackageName, getPublishDir,
} from '../config.ts';
import type { PublishablePackage } from '../config.ts';
import { checkConsumer } from '../lib/consumerCheck.ts';
import { logStep, run } from '../lib/exec.ts';
import { rewriteAllStarExports } from '../lib/starExports.ts';
import type { PublishedPackage } from '../lib/starExports.ts';

const REMOVED_DIRS = new Set(['__tests__', 'tests', '__mocks__', '__snapshots__']);

const BABEL_IGNORE = [
  '**/*.d.ts',
  '**/*.d.tsx',
  '**/node_modules/**',
  'tests',
  'spec.js',
  'spec.jsx',
  'spec.ts',
  'spec.tsx',
  '__snapshots__',
  '.eslintrc.js',
  'jest.config.js',
  'dist',
  'coverage',
  'node_modules',
].join(',');

const PUBLISHED_TSCONFIG = 'tsconfig.extension.json';

/**
 * Checks whether a file must not be published: specs and tsconfig files, except the tsconfig
 * that extensions extend.
 * @param name The file name.
 * @returns Whether the file gets removed from the build.
 */
const isRemovedFile = (name: string) => (
  name.includes('.spec.')
  || name.startsWith('spec.')
  || (/^tsconfig.*\.json$/.test(name) && name !== PUBLISHED_TSCONFIG)
);

/**
 * Returns the packages that are built into "dist" before publishing.
 * @returns The transpiled packages.
 */
const transpiledPackages = () => PUBLISHABLE_PACKAGES.filter(pkg => pkg.transpile);

/**
 * Deletes the "dist" folder of a package.
 * @param pkg The package.
 * @param root The repository root.
 */
export const purge = (pkg: PublishablePackage, root = ROOT) => {
  fs.rmSync(getPublishDir(pkg, root), {
    recursive: true,
    force: true,
  });
};

/**
 * Removes tests, jest mocks, snapshots, specs and tsconfig files from a build. Folders named
 * "mocks" stay, since they contain fixtures that extensions use, and so does the tsconfig for
 * extensions.
 * @param dir The build directory.
 */
export const normalize = (dir: string) => {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const entryPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (REMOVED_DIRS.has(entry.name)) {
        fs.rmSync(entryPath, {
          recursive: true,
          force: true,
        });
      } else {
        normalize(entryPath);
      }
    } else if (isRemovedFile(entry.name)) {
      fs.rmSync(entryPath, { force: true });
    }
  });
};

/**
 * Transpiles a package with babel into "dist", generates types if configured and normalizes it.
 * @param pkg The package.
 * @param root The repository root.
 */
export const build = (pkg: PublishablePackage, root = ROOT) => {
  const bin = path.join(root, 'node_modules', '.bin');

  logStep(`Building ${pkg.dir}`);
  purge(pkg, root);

  run(path.join(bin, 'babel'), [
    `./${pkg.dir}/`,
    '--out-dir',
    `./${pkg.dir}/dist`,
    '--extensions',
    '.js,.jsx,.ts,.tsx',
    '--copy-files',
    '--ignore',
    BABEL_IGNORE,
  ], {
    cwd: root,
    env: { BABEL_ENV: 'production' },
  });

  const tsconfig = `./${pkg.dir}/tsconfig.build.json`;
  if (fs.existsSync(path.join(root, tsconfig))) {
    const start = performance.now();
    run(path.join(bin, 'tsc'), ['-p', tsconfig, '--noCheck'], { cwd: root });
    const duration = Math.round(performance.now() - start);

    const declarations = fs.readdirSync(getPublishDir(pkg, root), { recursive: true })
      .filter(file => String(file).endsWith('.d.ts'));
    console.log(`Successfully generated ${declarations.length} declaration ${declarations.length === 1 ? 'file' : 'files'} with tsc (${duration}ms).`);
  }

  normalize(getPublishDir(pkg, root));
};

/**
 * Returns the transpiled packages with their npm names and the directories they are published
 * from.
 * @param root The repository root.
 * @returns The packages.
 */
const publishedPackages = (root = ROOT): PublishedPackage[] => (
  transpiledPackages().map(pkg => ({
    name: getPackageName(pkg.dir, root),
    dir: getPublishDir(pkg, root),
  }))
);

/**
 * Makes sure that every name a declaration file re-exports with `export *` reaches the consumer.
 * A star export to a module that is published without declarations is replaced by the list of
 * its names. It runs after all packages are built, since a star export can point to another
 * package.
 * @param root The repository root.
 */
export const completeStarExports = (root = ROOT) => {
  logStep('Completing star exports of the type declarations');

  const unresolved = rewriteAllStarExports(publishedPackages(root));

  if (unresolved.length > 0) {
    const list = unresolved
      .map(({ file, specifier }) => `  ${path.relative(root, file)}: ${specifier}`)
      .join('\n');

    throw new Error(`The names of these star exports can't be determined:\n${list}`);
  }
};

/**
 * Type checks the built packages the way an extension uses them. It fails when the declarations
 * of a module lack a name that the module exports.
 * @param root The repository root.
 */
export const checkDeclarations = (root = ROOT) => {
  logStep('Checking the type declarations as an extension');

  const start = performance.now();
  const count = checkConsumer(publishedPackages(root), root);

  console.log(`Successfully checked ${count} modules (${Math.round(performance.now() - start)}ms).`);
};

/**
 * Builds all transpiled packages.
 * @param root The repository root.
 */
export const buildAll = (root = ROOT) => {
  transpiledPackages().forEach(pkg => build(pkg, root));
  completeStarExports(root);
  checkDeclarations(root);
};

/**
 * Deletes the "dist" folders of all transpiled packages.
 * @param root The repository root.
 */
export const purgeAll = (root = ROOT) => {
  transpiledPackages().forEach(pkg => purge(pkg, root));
};

/**
 * Removes test files from the existing "dist" folders without building.
 * @param root The repository root.
 */
export const normalizeAll = (root = ROOT) => {
  transpiledPackages()
    .map(pkg => getPublishDir(pkg, root))
    .filter(dir => fs.existsSync(dir))
    .forEach(dir => normalize(dir));
};
