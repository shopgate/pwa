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
    '^.+\\.(css|scss)$': 'identity-obj-proxy',
    // Fix issue with Swiper ES module imports that work via "exports" field in package.json
    '^swiper/react$': '<rootDir>/node_modules/swiper/swiper-react.mjs',
    // Mock Swiper styles since they are not needed for unit tests
    '^swiper/css(?:/.*)?$': '<rootDir>/__mocks__/styleMock.js',
  },
  testPathIgnorePatterns: [
    ...defaultConfig.testPathIgnorePatterns,
    '/extensions/',
  ],
  coveragePathIgnorePatterns: [
    '/extensions/',
    '/e2e/',
  ],
};
