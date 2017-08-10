/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

 module.exports = {
  plugins: [
    'eslint-comments',
    'extra-rules',
  ],
  rules: {
    'extra-rules/no-commented-out-code': 2,
    'extra-rules/no-single-line-objects': 1,
    'extra-rules/potential-point-free': 1,
    'eslint-comments/disable-enable-pair': 'error',
    'eslint-comments/no-duplicate-disable': 'error',
    'eslint-comments/no-unlimited-disable': 'error',
    'eslint-comments/no-unused-disable': 'error',
    'eslint-comments/no-unused-enable': 'error',
    'eslint-comments/no-use': 'warn'
  },
};
