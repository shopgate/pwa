module.exports = {
  moduleFileExtensions: ['js', 'jsx', 'json', 'mjs'],
  moduleNameMapper: {
    '^.+\\.(css|scss)$': 'identity-obj-proxy',
    '^swiper/react$': '<rootDir>/node_modules/swiper/swiper-react.mjs',
    '^swiper/css': '<rootDir>/__mocks__/styleMock.js',
    '^swiper/a11y': '<rootDir>/__mocks__/styleMock.js',
    '^swiper/pagination': '<rootDir>/__mocks__/styleMock.js',
    '^swiper/navigation': '<rootDir>/__mocks__/styleMock.js',
    '^swiper/zoom': '<rootDir>/__mocks__/styleMock.js',
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
