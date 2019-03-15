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
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/themes/*/extensions/',
    '/themes/*/e2e/',
  ],
  transformIgnorePatterns: [
    '/node_modules/(?![swiper|dom7].*/)',
    '/themes/*/extensions/',
    '/themes/*/e2e/',
  ],
};
