/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ERROR_OPEN_DEEP_LINK } from '../../constants/ActionTypes';

/**
 * Creates the ERROR_OPEN_DEEP_LINK action object.
 * @returns {Object} A redux action.
 */
const errorOpenDeepLink = () => ({
  type: ERROR_OPEN_DEEP_LINK,
});

export default errorOpenDeepLink;
