// Require the default configuration.
const defaultConfig = require('@shopgate/pwa-unit-test/jest.config');

// Extend the default configuration.
module.exports = {
  ...defaultConfig,
  moduleNameMapper: {
    '^Components(.*)$': '<rootDir>/components',
    '^Config(.*)$': '<rootDir>/config',
    '^Extensions(.*)$': '<rootDir>/extensions',
    '^Pages(.*)$': '<rootDir>/pages',
    '^Styles(.*)$': '<rootDir>/styles',
    '^.+\\.(css|scss)$': 'identity-obj-proxy',
  },
  testPathIgnorePatterns: [
    ...defaultConfig.testPathIgnorePatterns,
    '/extensions/',
  ],
  coveragePathIgnorePatterns: [
    '/extensions/',
    '/e2e/'
  ],
};
