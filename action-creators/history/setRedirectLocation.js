/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { HISTORY_SET_REDIRECT_LOCATION } from '../../constants/ActionTypes';

/**
 * Creates the HISTORY_SET_REDIRECT_LOCATION action object.
 * @param {string|null} pathname The url which should be stored.
 * @param {Object} [params={}] The params which should be stored.
 * @returns {Object} A redux action.
 */
const setRedirectLocation = (pathname, params = {}) => ({
  type: HISTORY_SET_REDIRECT_LOCATION,
  pathname,
  params,
});

export default setRedirectLocation;
