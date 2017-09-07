/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ERROR_URL } from '../../constants/ActionTypes';

/**
 * Creates the dispatched ERROR_URL action object.
 * @param {string} urlType The url type.
 * @returns {Object} The dispatched action object.
 */
const errorUrl = urlType => ({
  type: ERROR_URL,
  urlType,
});

export default errorUrl;
