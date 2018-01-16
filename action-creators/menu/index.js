/**
 * Copyright (c) 2018, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  REQUEST_MENU,
  RECEIVE_MENU,
  ERROR_MENU,
} from '../../constants/ActionTypes';

/**
 * Creates the dispatched REQUEST_MENU action object.
 * @param {string} id The menu id.
 * @return {Object} The dispatched action object.
 */
export const requestMenu = id => ({
  type: REQUEST_MENU,
  id,
});

/**
 * Creates the dispatched RECEIVE_MENU action object
 * @param {string} id The menu id.
 * @param {Array} entries The menu entries.
 * @return {Object} The dispatched action object.
 */
export const receiveMenu = (id, entries) => ({
  type: RECEIVE_MENU,
  id,
  entries,
});

/**
 * Creates the dispatched ERROR_MENU action object.
 * @param {string} id The menu id.
 * @return {Object} The dispatched action object.
 */
export const errorMenu = id => ({
  type: ERROR_MENU,
  id,
});
