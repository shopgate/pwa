const fs = require('fs');
const path = require('path');

/**
 * Resolves the absolute path to a given package, taking into account different development
 * and deployment contexts (theme, monorepo, or globally hoisted dependencies).
 *
 * The resolution strategy tries multiple locations in order:
 *  1. The theme’s local `node_modules` (used in deployment or external developer mode).
 *  2. The global monorepo root’s `node_modules` (used in monorepo development mode).
 *  3. The current working directory’s `node_modules`.
 *  4. Falls back to Node's `require.resolve()` if no path exists, allowing Yarn workspaces
 *     or hoisting to handle resolution.
 *
 * @param {string} pkgName - The name of the package to resolve.
 * @param {string} [extraSubPath=''] - Optional subpath inside the package.
 * @param {string} [themePath=process.cwd()] - Base path of the theme. Defaults to the current
 * working directory.
 * @returns {string} The resolved absolute path to the requested package or subpath.
 *
 */
const resolveForAliasPackage = (pkgName, extraSubPath = '', themePath = process.cwd()) => {
  const tryPaths = [
    path.resolve(themePath, 'node_modules', pkgName + extraSubPath),
    path.resolve(themePath, '..', '..', 'node_modules', pkgName + extraSubPath),
    path.resolve(process.cwd(), 'node_modules', pkgName + extraSubPath),
  ];

  const hit = tryPaths.find(candidate => fs.existsSync(candidate)) || null;

  if (!hit) {
    // fallback to Node's own algorithm (which will follow Yarn workspaces / hoisting)
    return require.resolve(pkgName + extraSubPath);
  }

  return hit;
};

module.exports = {
  resolveForAliasPackage,
};
