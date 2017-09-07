/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ERROR_USER } from '../../constants/ActionTypes';

/**
 * Creates the dispatched ERROR_USER action object.
 * @returns {Object} The dispatched action object.
 */
const errorUser = () => ({
  type: ERROR_USER,
});

export default errorUser;
