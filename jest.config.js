const jestConfig = require('@shopgate/pwa-unit-test/jest.config');

module.exports = {
  ...jestConfig,
  moduleNameMapper: {
    '^.+\\.(css|scss)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: [
    'extensions/*/frontend/**/*.{js,jsx}',
    'libraries/*/**/*.{js,jsx}',
    'themes/*/**/*.{js,jsx}',
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
    'node_modules/(?!(swiper|dom7)/)',
    '/themes/*/extensions/',
    '/themes/*/e2e/',
  ],
};
