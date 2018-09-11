module.exports = {
  moduleFileExtensions: ['js', 'jsx', 'json'],
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
    '<rootDir>/node_modules/react/',
    '<rootDir>/node_modules/enzyme/',
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
  setupTestFrameworkScriptFile: '@shopgate/pwa-unit-test/envSetup.js',
  testURL: 'http://localhost',
};
