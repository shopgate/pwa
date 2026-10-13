import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

/**
 * A package as it gets published.
 */
export interface PublishedPackage {
  /**
   * The npm name, e.g. "@shopgate/engage".
   */
  name: string;
  /**
   * Absolute path of the directory the package is published from.
   */
  dir: string;
}

/**
 * A star export in a declaration file that passes on no names, because its target has no
 * declarations.
 */
export interface UntypedStarExport {
  /**
   * Absolute path of the declaration file.
   */
  file: string;
  /**
   * The module the star export points to, as it is written in the file.
   */
  specifier: string;
}

/**
 * A node of a parsed JavaScript module, reduced to what is read from export statements.
 */
interface ModuleNode {
  type: string;
  name?: string;
  value?: string | ModuleNode;
  id?: ModuleNode | null;
  source?: ModuleNode | null;
  exported?: ModuleNode;
  declaration?: ModuleNode | null;
  declarations?: ModuleNode[];
  specifiers?: ModuleNode[];
  properties?: ModuleNode[];
  elements?: (ModuleNode | null)[];
  argument?: ModuleNode;
  left?: ModuleNode;
}

const COMMONJS_EXPORTS = /\b(?:module\.exports|exports\.[A-Za-z_$][\w$]*\s*=|Object\.defineProperty\(exports)/;
const STAR_EXPORT = /^([ \t]*)export \* from (["'])([^"']+)\2;?[ \t]*$/gm;
const NAMED_EXPORTS = /^[ \t]*export (?:type )?\{([^}]*)\}/gm;
const DECLARED_EXPORT = /^[ \t]*export (?:declare )?(?:abstract )?(?:const|let|var|function|class|type|interface|enum|namespace) ([A-Za-z_$][\w$]*)/gm;

/**
 * The parser of Babel, reduced to how it is called here.
 */
type ParseSync = (code: string, options: Record<string, unknown>) => {
  program: { body: ModuleNode[] };
} | null;

/**
 * Loads the parser of Babel. It is loaded when it is first needed and not with an import
 * statement, since parts of the release tooling run before the dependencies are installed.
 * @returns The parser.
 */
const loadParser = (): ParseSync => createRequire(import.meta.url)('@babel/core').parseSync;

/**
 * Finds the file of a module.
 * @param base Absolute path of the module without a file extension.
 * @param extensions The file extensions to look for.
 * @returns The path of the file, or null when the module has no such file.
 */
export const findModuleFile = (base: string, extensions: string[]) => {
  const candidates = extensions.flatMap(extension => [
    `${base}${extension}`,
    path.join(base, `index${extension}`),
  ]);

  return candidates.find(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile())
    ?? null;
};

/**
 * Resolves a module specifier to a path inside the published packages.
 * @param specifier The module specifier.
 * @param fromFile Absolute path of the file that contains the specifier.
 * @param packages The published packages.
 * @returns Absolute path of the module without a file extension, or null when the module doesn't
 * belong to the published packages.
 */
const resolveModule = (specifier: string, fromFile: string, packages: PublishedPackage[]) => {
  if (specifier.startsWith('.')) {
    return path.resolve(path.dirname(fromFile), specifier);
  }

  const pkg = packages.find(({ name }) => specifier === name || specifier.startsWith(`${name}/`));

  return pkg ? path.join(pkg.dir, specifier.slice(pkg.name.length + 1)) : null;
};

/**
 * Reads the name of an exported binding, which is an identifier or a string.
 * @param node The node.
 * @returns The name, or an empty string when the node has none.
 */
const getName = (node: ModuleNode | null | undefined) => {
  if (typeof node?.name === 'string') {
    return node.name;
  }

  return typeof node?.value === 'string' ? node.value : '';
};

/**
 * Collects the names a binding pattern declares, e.g. of `export const { a, b } = c`.
 * @param node The pattern.
 * @returns The names.
 */
const getPatternNames = (node: ModuleNode | null | undefined): string[] => {
  switch (node?.type) {
    case 'Identifier':
      return node.name ? [node.name] : [];
    case 'ObjectPattern':
      return (node.properties ?? []).flatMap((property) => {
        if (property.type === 'RestElement') {
          return getPatternNames(property.argument);
        }

        return typeof property.value === 'object' ? getPatternNames(property.value) : [];
      });
    case 'ArrayPattern':
      return (node.elements ?? []).flatMap(element => getPatternNames(element));
    case 'AssignmentPattern':
      return getPatternNames(node.left);
    case 'RestElement':
      return getPatternNames(node.argument);
    default:
      return [];
  }
};

/**
 * Collects the names a JavaScript module exports. Star exports inside the module are followed as
 * long as they stay inside the published packages.
 * @param file Absolute path of the JavaScript file.
 * @param packages The published packages.
 * @param visited The files that were already read, to stop at circular exports.
 * @returns The exported names without the default export, which a star export doesn't pass on.
 */
export const getExportNames = (
  file: string,
  packages: PublishedPackage[],
  visited = new Set<string>()
): string[] => {
  if (visited.has(file)) {
    return [];
  }

  visited.add(file);

  const ast = loadParser()(fs.readFileSync(file, 'utf8'), {
    configFile: false,
    babelrc: false,
    sourceType: 'module',
    filename: file,
  });

  const names = (ast?.program.body ?? []).flatMap((node) => {
    if (node.type === 'ExportAllDeclaration') {
      if (node.exported) {
        return [getName(node.exported)];
      }

      const base = resolveModule(getName(node.source), file, packages);
      const target = base ? findModuleFile(base, ['.js']) : null;

      return target ? getExportNames(target, packages, visited) : [];
    }

    if (node.type !== 'ExportNamedDeclaration') {
      return [];
    }

    const declared = node.declaration?.declarations
      ? node.declaration.declarations.flatMap(declarator => getPatternNames(declarator.id))
      : getPatternNames(node.declaration?.id);

    const specified = (node.specifiers ?? []).map(specifier => getName(specifier.exported));

    return [...declared, ...specified];
  });

  return [...new Set(names)].filter(name => name !== '' && name !== 'default');
};

/**
 * Collects the names a declaration file exports itself, without the ones of its star exports.
 * @param content The content of the declaration file.
 * @returns The exported names.
 */
const getDeclaredNames = (content: string) => {
  const fromLists = [...content.matchAll(NAMED_EXPORTS)].flatMap(([, list]) => (
    list.split(',').map(entry => entry.trim().split(/\s+as\s+/).pop()?.replace(/^type\s+/, '') ?? '')
  ));
  const fromDeclarations = [...content.matchAll(DECLARED_EXPORT)].map(([, name]) => name);

  return new Set([...fromLists, ...fromDeclarations].filter(name => name !== ''));
};

/**
 * Lists the declaration files of a directory.
 * @param dir Absolute path of the directory.
 * @returns Absolute paths of the declaration files.
 */
export const listDeclarationFiles = (dir: string) => (
  fs.readdirSync(dir, {
    recursive: true,
    withFileTypes: true,
  })
    .filter(entry => entry.isFile() && entry.name.endsWith('.d.ts'))
    .map(entry => path.join(entry.parentPath, entry.name))
    .filter(file => !file.split(path.sep).includes('node_modules'))
);

/**
 * Replaces the star exports of a declaration file that point to a published module without
 * declarations. Such a module is `any` for the consumer, and a star export of `any` passes on no
 * names, so the names are listed instead: `export { a, b } from '...'`.
 * @param file Absolute path of the declaration file.
 * @param packages The published packages.
 * @returns The star exports that could not be replaced: the module has no JavaScript file either,
 * or its exports can't be read because it isn't an ES module.
 */
export const rewriteStarExports = (file: string, packages: PublishedPackage[]) => {
  const content = fs.readFileSync(file, 'utf8');
  const taken = getDeclaredNames(content);
  const unresolved: UntypedStarExport[] = [];

  const rewritten = content.replace(STAR_EXPORT, (
    line,
    indent: string,
    quote: string,
    specifier: string
  ) => {
    const base = resolveModule(specifier, file, packages);

    if (!base || findModuleFile(base, ['.d.ts'])) {
      return line;
    }

    const source = findModuleFile(base, ['.js']);

    if (!source) {
      unresolved.push({
        file,
        specifier,
      });

      return line;
    }

    const exported = getExportNames(source, packages);

    if (exported.length === 0 && COMMONJS_EXPORTS.test(fs.readFileSync(source, 'utf8'))) {
      unresolved.push({
        file,
        specifier,
      });

      return line;
    }

    const names = exported.filter(name => !taken.has(name));

    names.forEach(name => taken.add(name));

    return `${indent}export { ${names.join(', ')} } from ${quote}${specifier}${quote};`;
  });

  if (rewritten !== content) {
    fs.writeFileSync(file, rewritten);
  }

  return unresolved;
};

/**
 * Replaces the star exports to modules without declarations in all declaration files of the
 * published packages.
 * @param packages The published packages.
 * @returns The star exports that could not be replaced.
 */
export const rewriteAllStarExports = (packages: PublishedPackage[]) => (
  packages
    .filter(pkg => fs.existsSync(pkg.dir))
    .flatMap(pkg => listDeclarationFiles(pkg.dir))
    .flatMap(file => rewriteStarExports(file, packages))
);
