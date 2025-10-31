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
    '^swiper/react$': '<rootDir>/node_modules/swiper/swiper-react.mjs',
    '^swiper/css': '<rootDir>/__mocks__/styleMock.js',
    '^swiper/a11y': '<rootDir>/__mocks__/styleMock.js',
    '^swiper/pagination': '<rootDir>/__mocks__/styleMock.js',
    '^swiper/navigation': '<rootDir>/__mocks__/styleMock.js',
    '^swiper/zoom': '<rootDir>/__mocks__/styleMock.js',
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
