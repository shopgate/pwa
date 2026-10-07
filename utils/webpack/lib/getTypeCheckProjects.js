const fs = require('fs');
const path = require('path');

/**
 * @typedef {Object} TypeCheckProject
 * @property {string} name The name that is shown in front of the output of the project.
 * @property {string} path The folder that contains the tsconfig.json of the project.
 * @property {boolean} isTheme Whether the project is the theme.
 * @property {string|null} tsc The TypeScript compiler of the project, when it has one installed.
 */

/**
 * Resolves the TypeScript compiler that a project has installed.
 * @param {string} projectPath The folder of the project.
 * @return {string|null}
 */
function resolveCompiler(projectPath) {
  try {
    const packagePath = require.resolve('typescript/package.json', { paths: [projectPath] });
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const { bin } = require(packagePath);

    return path.resolve(path.dirname(packagePath), bin.tsc);
  } catch (error) {
    return null;
  }
}

/**
 * Returns the theme and the frontends of the attached extensions that have a tsconfig.json.
 * @param {string} themePath The folder of the theme.
 * @param {Object} [extensions={}] The attached extensions.
 * @return {TypeCheckProject[]}
 */
module.exports = function getTypeCheckProjects(themePath, extensions = {}) {
  const extensionsPath = path.resolve(themePath, '..', '..', 'extensions');

  return [
    {
      name: path.basename(themePath),
      path: themePath,
      isTheme: true,
    },
    ...Object.keys(extensions).map(id => ({
      name: id,
      path: path.resolve(extensionsPath, extensions[id].path, 'frontend'),
      isTheme: false,
    })),
  ]
    .filter(project => fs.existsSync(path.join(project.path, 'tsconfig.json')))
    .map(project => ({
      ...project,
      tsc: resolveCompiler(project.path),
    }));
};
