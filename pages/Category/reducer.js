/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  GRID_VIEW,
  SET_CATEGORY_VIEW_MODE,
} from './constants';

/**
 * Stores all the view information.
 * @param {Object} state The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
export default (state = {
  viewMode: GRID_VIEW,
}, action) => {
  switch (action.type) {
    case SET_CATEGORY_VIEW_MODE:
      return {
        ...state,
        viewMode: action.viewMode,
      };
    default:
      return state;
  }
};
