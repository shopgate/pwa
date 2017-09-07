/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ERROR_MENU } from '../../constants/ActionTypes';

/**
 * Creates the dispatched ERROR_MENU action object.
 * @param {string} id The menu id.
 * @return {Object} The ERROR_MENU action.
 */
const errorMenu = id => ({
  type: ERROR_MENU,
  id,
});

export default errorMenu;
