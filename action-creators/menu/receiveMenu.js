/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { RECEIVE_MENU } from '../../constants/ActionTypes';

/**
 * Creates the dispatched RECEIVE_MENU action object
 * @param {string} id The menu id.
 * @param {Object} entries The menu entries.
 * @return {Object} The RECEIVE_MENU action.
 */
const receiveMenu = (id, entries) => ({
  type: RECEIVE_MENU,
  id,
  entries,
});

export default receiveMenu;
