/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { REQUEST_CLIENT_INFORMATION } from '../../constants/ActionTypes';

/**
 * Creates the dispatched REQUEST_CLIENT_INFORMATION action object.
 * @returns {Object} The dispatched action object.
 */
const requestClientInformation = () => ({
  type: REQUEST_CLIENT_INFORMATION,
});

export default requestClientInformation;
