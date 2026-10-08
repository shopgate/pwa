const fs = require('fs');
const path = require('path');
const configImportPattern = require('./helpers/configImportPattern');

const CONFIG_IMPORT_REGEX = new RegExp(configImportPattern);
const MODULE_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx'];

/**
 * Checks whether an import target without file extension points to a script module.
 * @param {string} target The absolute import target.
 * @returns {boolean}
 */
const isScriptModule = target => MODULE_EXTENSIONS.some(extension => (
  fs.existsSync(`${target}${extension}`) || fs.existsSync(path.join(target, `index${extension}`))
));

/**
 * Checks whether a relative config import can be resolved.
 * @param {string} target The absolute import target.
 * @returns {boolean}
 */
const isResolvable = (target) => {
  if (target.endsWith('.json')) {
    return fs.existsSync(target);
  }

  return isScriptModule(target) || fs.existsSync(`${target}.json`);
};

/**
 * Checks whether an import target is the config.json which the platform SDK generates inside
 * the frontend and extension folders of an extension.
 * @param {string} target The absolute import target.
 * @returns {boolean}
 */
const isGeneratedConfig = target => (
  fs.existsSync(path.join(path.dirname(target), '..', 'extension-config.json'))
);

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Warn about imports of an extension config.json that was not generated yet',
    },
    schema: [],
    messages: {
      unresolved: 'Unable to resolve path to module "{{source}}".',
      missing: '"{{source}}" doesn\'t exist yet. The platform SDK generates it for attached extensions ("sgconnect extension attach") when the frontend or backend is started. The warning can be ignored until then; don\'t change code or the ESLint config to hide it.',
    },
  },
  create: (context) => {
    /**
     * Reports a source node that points to a config which can't be resolved.
     * @param {Object} [sourceNode] The node that holds the import source.
     */
    const check = (sourceNode) => {
      const source = sourceNode?.value;

      if (typeof source !== 'string' || !CONFIG_IMPORT_REGEX.test(source)) {
        return;
      }

      const target = path.resolve(path.dirname(context.getFilename()), source);

      if (isResolvable(target)) {
        return;
      }

      context.report({
        node: sourceNode,
        messageId: isGeneratedConfig(target) ? 'missing' : 'unresolved',
        data: { source },
      });
    };

    return {
      ImportDeclaration: node => check(node.source),
      ImportExpression: node => check(node.source),
      ExportNamedDeclaration: node => check(node.source),
      ExportAllDeclaration: node => check(node.source),
      CallExpression: (node) => {
        if (node.callee.name === 'require' && node.arguments.length === 1) {
          check(node.arguments[0]);
        }
      },
    };
  },
};
