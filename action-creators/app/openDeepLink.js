/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { OPEN_DEEP_LINK } from '../../constants/ActionTypes';

/**
 * Creates the OPEN_DEEP_LINK action object.
 * @param {Object} payload The payload of the deeplink
 * @returns {Object} A redux action.
 */
const openDeepLink = payload => ({
  type: OPEN_DEEP_LINK,
  payload,
});

export default openDeepLink;
