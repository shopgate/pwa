/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ERROR_CLIENT_INFORMATION } from '../../constants/ActionTypes';

/**
 * Creates the dispatched ERROR_CLIENT_INFORMATION action object.
 * @returns {Object} The dispatched action object.
 */
const errorClientInformation = () => ({
  type: ERROR_CLIENT_INFORMATION,
});

export default errorClientInformation;
