/*
 *  Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 *  This source code is licensed under the Apache 2.0 license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 */
import { ERROR_FETCH_FAVORITES } from '../constants';

/**
 * Error on fetch favorites action.
 * @param {Object} error Error.
 * @returns {Object}
 */
export default error => ({
  type: ERROR_FETCH_FAVORITES,
  error,
});
