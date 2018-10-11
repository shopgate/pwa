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
    '!*/**/.eslintrc.js',
    '!*/**/jest.config.js',
    '!themes/*/extensions/**/*.js',
    '!themes/*/e2e/**/*.js',
    '!themes/theme-ios11/**/*.js',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/themes/theme-ios11/',
    '/themes/*/extensions/',
    '/themes/*/e2e/',
  ],
  transformIgnorePatterns: [
    '/node_modules/',
    '/themes/theme-ios11/',
    '/themes/*/extensions/',
    '/themes/*/e2e/',
  ],
};
