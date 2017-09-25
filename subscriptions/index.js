/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import setup from './setup';
import pages from './pages';
import product from './product';
import user from './user';
import cart from './cart';
import checkout from './checkout';

/**
 * Holds all subscriber references.
 * @type {Array}
 */
export default [
  setup,
  pages,
  product,
  user,
  cart,
  checkout,
];
