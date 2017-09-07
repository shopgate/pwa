/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { RECEIVE_URL } from '../../constants/ActionTypes';

/**
 * Creates the dispatched RECEIVE_URL action object.
 * @param {string} urlType The url type.
 * @param {string} url The requested url.
 * @param {number|null} [expires=null] The expires date of the url.
 * @returns {Object} The dispatched action object.
 */
const receiveUrl = (urlType, url, expires = null) => ({
  type: RECEIVE_URL,
  url,
  urlType,
  expires,
});

export default receiveUrl;
