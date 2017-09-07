/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  CATEGORY_LIFETIME,
  REQUEST_CATEGORY,
  RECEIVE_CATEGORY,
  REQUEST_CATEGORY_CHILDREN,
  RECEIVE_CATEGORY_CHILDREN,
  ERROR_CATEGORY,
  ERROR_CATEGORY_CHILDREN,
} from '../constants';

/**
 * Stores a collection of child category IDs by their parent's category ID.
 * @param {Object} [state={}] The current state.
 * @param {Object} action The action object.
 * @returns {Object} The new state.
 */
const childrenByCategoryId = (state = {}, action) => {
  switch (action.type) {
    case REQUEST_CATEGORY:
    case REQUEST_CATEGORY_CHILDREN:
      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          children: null,
          isFetching: true,
          expires: 0,
        },
      };
    case RECEIVE_CATEGORY:
    case RECEIVE_CATEGORY_CHILDREN: {
      const actionChildren = action.categoryChildren;

      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          // If it has children, append them.
          children: actionChildren ? action.categoryChildren.map(child => child.id) : null,
          isFetching: false,
          expires: Date.now() + CATEGORY_LIFETIME,
        },
      };
    }
    case ERROR_CATEGORY:
    case ERROR_CATEGORY_CHILDREN:
      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          isFetching: false,
        },
      };
    default:
      return state;
  }
};

export default childrenByCategoryId;
