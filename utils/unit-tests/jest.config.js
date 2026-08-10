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

const stylesMock = require.resolve('./mocks/styles.js');

/**
 * Swiper exposes its React build via the "exports" field of its package.json, which jest can't
 * resolve. Mapping it to the concrete file fixes that. Resolving it from this package works for
 * consumers as well, and only falls back to the rootDir of the consumer when swiper is installed
 * somewhere this package can't reach.
 */
let swiperReact = '<rootDir>/node_modules/swiper/swiper-react.mjs';

try {
  swiperReact = require.resolve('swiper/react');
} catch (e) { /* swiper is not installed */ }

/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  silent: false,
  moduleFileExtensions: ['js', 'jsx', 'json', 'mjs', 'ts', 'tsx'],
  moduleNameMapper: {
    // Mock styles since they are not needed for unit tests
    '\\.(css|sass|scss|less)$': stylesMock,
    // Mock assets since they are not needed for unit tests
    '\\.(jpg|jpeg|png|gif|webp|svg|ico|eot|otf|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': require.resolve('./mocks/assets.js'),
    '^swiper/react$': swiperReact,
    // Mock Swiper styles - they are imported without a file extension
    '^swiper/css(?:/.*)?$': stylesMock,
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
  // @shopgate packages are published untranspiled, so they need to be transformed as well. Within
  // this repository they are symlinked to their sources outside of node_modules, which is why the
  // missing entry didn't surface here, but only within extensions which install them for real.
  transformIgnorePatterns: [
    'node_modules/(?!(@shopgate|swiper|dom7|intl-messageformat|@formatjs|tslib)/)',
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
