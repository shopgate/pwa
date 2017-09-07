/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { REQUEST_URL } from '../../constants/ActionTypes';

/**
 * Creates the dispatched REQUEST_URL action object.
 * @param {string} urlType The url type.
 * @returns {Object} The dispatched action object.
 */
const requestUrl = urlType => ({
  type: REQUEST_URL,
  urlType,
});

export default requestUrl;
