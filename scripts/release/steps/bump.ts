import fs from 'node:fs';
import path from 'node:path';
import { ROOT, getThemes } from '../config.ts';

/**
 * The parts of a package.json that the version bump touches.
 */
interface PackageJson {
  /**
   * npm package name.
   */
  name: string;
  /**
   * Package version that gets bumped.
   */
  version: string;
  /**
   * Workspace patterns. Only set in the root package.json.
   */
  workspaces?: string[];
  /**
   * Runtime dependencies. Exact pins of workspace packages get bumped.
   */
  dependencies?: Record<string, string>;
  /**
   * Development dependencies. Exact pins of workspace packages get bumped.
   */
  devDependencies?: Record<string, string>;
}

const EXACT_VERSION = /^\d+\.\d+\.\d+(-[0-9A-Za-z.]+)?$/;

/**
 * Reads and parses a JSON file.
 * @param file The file path.
 * @returns The parsed content.
 */
const readJson = <T>(file: string): T => JSON.parse(fs.readFileSync(file, 'utf8')) as T;

/**
 * Writes JSON with 2-space indentation and a trailing newline, like lerna did.
 * @param file The file path.
 * @param content The content to write.
 */
const writeJson = (file: string, content: unknown) => {
  fs.writeFileSync(file, `${JSON.stringify(content, null, 2)}\n`);
};

/**
 * Replaces the first "version" field of a JSON file as text, so the rest of the file keeps its
 * formatting (like uver did for the theme extension-config.json files).
 * @param file The file path.
 * @param version The new version.
 */
const replaceVersionField = (file: string, version: string) => {
  const content = fs.readFileSync(file, 'utf8');
  const pattern = /("version"\s*:\s*")[^"]*(")/;

  if (!pattern.test(content)) {
    throw new Error(`No "version" field found in ${file}`);
  }

  fs.writeFileSync(file, content.replace(pattern, `$1${version}$2`));
};

/**
 * Expands the root "workspaces" patterns ("dir/*" or plain directories) to package directories.
 * @param root The repository root.
 * @returns Package directories relative to the root.
 */
export const getWorkspaceDirs = (root = ROOT): string[] => {
  const { workspaces = [] } = readJson<PackageJson>(path.join(root, 'package.json'));

  return workspaces.flatMap((pattern) => {
    if (!pattern.endsWith('/*')) {
      return [pattern];
    }

    const parent = pattern.slice(0, -2);
    return fs.readdirSync(path.join(root, parent), { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .map(entry => `${parent}/${entry.name}`);
  }).filter(dir => fs.existsSync(path.join(root, dir, 'package.json')));
};

/**
 * Sets exact pins of workspace packages to the new version. Ranges and external packages stay.
 * @param deps The dependency map.
 * @param workspaceNames Names of all workspace packages.
 * @param version The new version.
 * @returns The updated dependency map, or undefined when there was none.
 */
const bumpDependencies = (
  deps: Record<string, string> | undefined,
  workspaceNames: Set<string>,
  version: string
) => deps && Object.fromEntries(Object.entries(deps).map(([name, spec]) => [
  name,
  workspaceNames.has(name) && EXACT_VERSION.test(spec) ? version : spec,
]));

/**
 * Sets the version of all workspaces, their exact internal (dev)dependency pins,
 * the theme extension-config.json files and lerna.json.
 * @param version The new version.
 * @param root The repository root.
 */
export const bumpVersions = (version: string, root = ROOT) => {
  const packages = getWorkspaceDirs(root).map((dir) => {
    const file = path.join(root, dir, 'package.json');
    return {
      file,
      json: readJson<PackageJson>(file),
    };
  });
  const workspaceNames = new Set(packages.map(({ json }) => json.name));

  packages.forEach(({ file, json }) => {
    writeJson(file, {
      ...json,
      version,
      dependencies: bumpDependencies(json.dependencies, workspaceNames, version),
      devDependencies: bumpDependencies(json.devDependencies, workspaceNames, version),
    });
    console.log(`${path.relative(root, file)} -> ${version}`);
  });

  const versionFiles = [
    ...getThemes(root).map(theme => path.join(theme.dir, 'extension-config.json')),
    'lerna.json',
  ];

  versionFiles.forEach((file) => {
    replaceVersionField(path.join(root, file), version);
    console.log(`${file} -> ${version}`);
  });
};
