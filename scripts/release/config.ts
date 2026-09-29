import fs from 'node:fs';
import path from 'node:path';

export const ROOT = path.resolve(import.meta.dirname, '../..');

export const GITHUB_REPO = 'shopgate/pwa';

/**
 * A workspace package that is published to npm.
 */
export interface PublishablePackage {
  /**
   * Package directory relative to the repository root.
   */
  dir: string;
  /**
   * Whether the package is built into "dist" and published from there. Otherwise the source
   * directory is published as is.
   */
  transpile: boolean;
}

/**
 * A theme that is synced to its own repository via git subtree.
 */
export interface Theme {
  /**
   * Theme name, e.g. "theme-gmd".
   */
  name: string;
  /**
   * Theme directory relative to the repository root, e.g. "themes/theme-gmd".
   */
  dir: string;
  /**
   * SSH URL of the theme repository that the subtree is pushed to.
   */
  gitUrl: string;
  /**
   * GitHub "owner/repo" of the theme, e.g. "shopgate/theme-gmd".
   */
  githubRepo: string;
}

const TRANSPILED_PACKAGE_DIRS = [
  'libraries/common',
  'libraries/commerce',
  'libraries/core',
  'libraries/tracking-core',
  'libraries/tracking',
  'libraries/webcheckout',
  'libraries/ui-ios',
  'libraries/ui-material',
  'libraries/ui-shared',
  'libraries/engage',
  'utils/unit-tests',
];

const SOURCE_PACKAGE_DIRS = [
  'utils/eslint-config',
  'utils/webpack',
];

export const PUBLISHABLE_PACKAGES: PublishablePackage[] = [
  ...TRANSPILED_PACKAGE_DIRS.map(dir => ({
    dir,
    transpile: true,
  })),
  ...SOURCE_PACKAGE_DIRS.map(dir => ({
    dir,
    transpile: false,
  })),
];

/**
 * Reads and parses a JSON file.
 * @param file The file path.
 * @returns The parsed content.
 */
const readJson = <T>(file: string): T => JSON.parse(fs.readFileSync(file, 'utf8')) as T;

/**
 * Returns the themes and their repositories from repos.json.
 * @param root The repository root.
 * @returns The themes.
 */
export const getThemes = (root = ROOT): Theme[] => {
  const { themes } = readJson<{ themes: Record<string, string> }>(path.join(root, 'repos.json'));

  return Object.entries(themes).map(([name, gitUrl]) => ({
    name,
    dir: `themes/${name}`,
    gitUrl,
    githubRepo: gitUrl.replace(/^git@github\.com:/, '').replace(/\.git$/, ''),
  }));
};

/**
 * Reads the npm package name of a workspace directory.
 * @param dir Package directory relative to the root.
 * @param root The repository root.
 * @returns The package name.
 */
export const getPackageName = (dir: string, root = ROOT): string => (
  readJson<{ name: string }>(path.join(root, dir, 'package.json')).name
);

/**
 * Returns the directory that gets published.
 * @param pkg The package.
 * @param root The repository root.
 * @returns "dist" of transpiled packages, the source directory otherwise.
 */
export const getPublishDir = (pkg: PublishablePackage, root = ROOT) => (
  path.join(root, pkg.dir, pkg.transpile ? 'dist' : '')
);
