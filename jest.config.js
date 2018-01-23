/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

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
    '/node_modules/',
    '/extensions/',
    '/public/',
    '/coverage/',
    '/components/Widgets/',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/extensions/',
    '/public/',
    '/coverage/',
    '/components/Widgets/',
  ],
};
