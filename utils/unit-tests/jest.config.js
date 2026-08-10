// Resolve everything from this package so consumers need no babel-jest,
// preset install, or local babel config of their own.
const babelJest = require.resolve('babel-jest');
const babelOptions = {
  babelrc: false,
  configFile: false,
  presets: [
    require.resolve('@babel/preset-env'),
    require.resolve('@babel/preset-react'),
    require.resolve('@babel/preset-typescript'),
  ],
};
const babelTransform = [babelJest, babelOptions];

/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  silent: false,
  moduleFileExtensions: ['js', 'jsx', 'json', 'mjs', 'ts', 'tsx'],
  moduleNameMapper: {
    // Mock styles since they are not needed for unit tests
    '\\.(css|sass)$': '<rootDir>/__mocks__/styleMock.js',
    // Fix issue with Swiper ES module imports that work via "exports" field in package.json
    '^swiper/react$': '<rootDir>/node_modules/swiper/swiper-react.mjs',
  },
  transform: {
    '^.+\\.jsx?$': babelTransform,
    '^.+\\.mjs$': babelTransform,
    '^.+\\.[jt]sx?$': babelTransform,
  },
  snapshotSerializers: [
    'enzyme-to-json/serializer',
  ],
  testRegex: '(/__tests__/.*|(\\.|/)spec)\\.(js|jsx|ts|tsx)?$',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/coverage/',
    '/config/',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(swiper|dom7|intl-messageformat|@formatjs|tslib)/)',
  ],
  unmockedModulePathPatterns: [
    'node_modules/react/',
    'node_modules/enzyme/',
  ],
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!.eslintrc.js',
    '!**/jest.config.js',
  ],
  setupFiles: [
    '@shopgate/pwa-unit-test/testSetup.js',
  ],
  setupFilesAfterEnv: [
    '@shopgate/pwa-unit-test/envSetup.js',
  ],
  testEnvironmentOptions: {
    url: 'http://localhost',
  },
};
