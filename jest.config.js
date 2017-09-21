/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  moduleFileExtensions: ['js', 'jsx', 'json'],
  snapshotSerializers: [
    'enzyme-to-json/serializer',
  ],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.js?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!@shopgate)/',
  ],
  testRegex: '(/__tests__/.*|(\\.|/)spec)\\.(js|jsx)?$',
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
  ],
  unmockedModulePathPatterns: [
    '<rootDir>/node_modules/react/',
    '<rootDir>/node_modules/enzyme/',
  ],
  collectCoverageFrom: [
    '**/*.{js,jsx}',
    '!**/node_modules/**',
  ],
  setupFiles: [
    '@shopgate/pwa-unit-test/testSetup.js',
  ],
  setupTestFrameworkScriptFile: '@shopgate/pwa-unit-test/envSetup.js',
};
