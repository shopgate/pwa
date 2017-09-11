/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { CREATE_MODAL, REMOVE_MODAL } from '../../constants/ActionTypes';

/**
 * Stores all the view information.
 * @param {Object} state The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
export default (state = [], action) => {
  switch (action.type) {
    case CREATE_MODAL:
      return [
        ...state,
        action.options,
      ];
    case REMOVE_MODAL:
      return state.filter(modal => modal.id !== action.id);
    default:
      return state;
  }
};
