/**
 * Copyright (c) 2017 - present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CREATE_TOAST, REMOVE_TOAST } from '../../constants/ActionTypes';

/**
 * Stores all the view information.
 * @param {Object} state The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
export default (state = [], action) => {
  switch (action.type) {
    case CREATE_TOAST:
      return [
        ...state,
        action.options,
      ];
    case REMOVE_TOAST:
      return state.filter(toast => toast.id !== action.id);
    default:
      return state;
  }
};
