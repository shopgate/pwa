const path = require('path');

const rootDir = process.env.EXTENSION_FRONTEND_DIR;

module.exports = {
  ...require(path.join(rootDir, 'jest.config.js')),
  rootDir,
  resolver: require.resolve('./isolated-resolver.cjs'),
};
