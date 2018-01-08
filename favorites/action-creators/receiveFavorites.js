/*
 *  Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 *  This source code is licensed under the Apache 2.0 license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 */
import { RECEIVE_FAVORITES } from '../constants';

/**
 * Receive favorites action.
 * @param {Array} products Products.
 * @returns {Object}
 */
export default products => ({
  type: RECEIVE_FAVORITES,
  products,
});
