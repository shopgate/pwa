/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { OPEN_DEEP_LINK } from '../../constants/ActionTypes';

/**
 * Creates the OPEN_DEEP_LINK action object.
 * @param {string} link The link to open.
 * @returns {Object} A redux action.
 */
const openDeepLink = link => ({
  type: OPEN_DEEP_LINK,
  link,
});

export default openDeepLink;
