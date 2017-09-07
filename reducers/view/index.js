/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  DECREMENT_VIEW_LOADING,
  INCREMENT_VIEW_LOADING,
  SET_VIEW_LOADING,
  SET_CATEGORY_VIEW_MODE,
  UNSET_VIEW_LOADING,
} from '../../constants/ActionTypes';

/**
 * Stores all the view information.
 * @param {Object} state The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
export default (state = {
  isLoading: {},
}, action) => {
  switch (action.type) {
    case DECREMENT_VIEW_LOADING:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          [action.pathname]: Math.max(0, state.isLoading[action.pathname] - 1),
        },
      };
    case INCREMENT_VIEW_LOADING:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          [action.pathname]: state.isLoading[action.pathname] + 1,
        },
      };
    case SET_VIEW_LOADING:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          [action.pathname]: 1,
        },
      };
    case UNSET_VIEW_LOADING: {
      const { [action.pathname]: exclude, ...views } = state.isLoading;

      return {
        ...state,
        isLoading: views,
      };
    }
    case SET_CATEGORY_VIEW_MODE:
      return {
        ...state,
      };
    default:
      return state;
  }
};
