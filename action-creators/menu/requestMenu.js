/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { REQUEST_MENU } from '../../constants/ActionTypes';

/**
 * Creates the dispatched REQUEST_MENU action object.
 * @param {string} id The menu id.
 * @return {Object} The REQUEST_MENU action.
 */
const requestMenu = id => ({
  type: REQUEST_MENU,
  id,
});

export default requestMenu;
