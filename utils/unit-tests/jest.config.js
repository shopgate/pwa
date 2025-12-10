module.exports = {
  moduleFileExtensions: ['js', 'jsx', 'json', 'mjs'],
  moduleNameMapper: {
    '^.+\\.(css|scss)$': 'identity-obj-proxy',
    // Fix issue with Swiper ES module imports that work via "exports" field in package.json
    '^swiper/react$': '<rootDir>/node_modules/swiper/swiper-react.mjs',
    // Mock Swiper styles since they are not needed for unit tests
    '^swiper/css(?:/.*)?$': '<rootDir>/__mocks__/styleMock.js',
  },
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.mjs$': 'babel-jest',
  },
  snapshotSerializers: [
    'enzyme-to-json/serializer',
  ],
  testRegex: '(/__tests__/.*|(\\.|/)spec)\\.(js|jsx)?$',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/coverage/',
    '/config/',
  ],
  transformIgnorePatterns: [
    '/node_modules/',
  ],
  unmockedModulePathPatterns: [
    'node_modules/react/',
    'node_modules/enzyme/',
  ],
  collectCoverageFrom: [
    '**/*.{js,jsx}',
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
  testURL: 'http://localhost',
};
