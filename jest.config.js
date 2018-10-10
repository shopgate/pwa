const jestConfig = require('./utils/unit-tests/jest.config');

module.exports = {
  ...jestConfig,
  moduleNameMapper: {
    '^.+\\.(css|scss)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: [
    'extensions/*/frontend/**/*.js',
    'libraries/*/**/*.js',
    'themes/*/**/*.js',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/themes/theme-ios11/',
  ],
  transformIgnorePatterns: [
    '/node_modules/',
  ],
};
