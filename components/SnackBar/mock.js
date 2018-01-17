/**
 * Copyright (c) 2018, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 *
 * @type {{id: number, message: string}}
 */
const toast1 = {
  id: 1,
  message: 'foo',
};

/**
 *
 * @type {{id: number, message: string}}
 */
const toast2 = {
  id: 2,
  message: 'bar',
};

/**
 * Mocked toast state
 * @type {{toast: [null,null]}}
 */
export const mockedState = {
  toast: [
    toast1,
    toast2,
  ],
};
