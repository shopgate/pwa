/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  CATEGORY_LIFETIME,
  RECEIVE_ROOT_CATEGORIES,
  REQUEST_CATEGORY,
  RECEIVE_CATEGORY,
  RECEIVE_CATEGORY_CHILDREN,
  ERROR_CATEGORY,
} from '../constants';
import handleCategoryCollection from './helpers/handleCategoryCollection';

/**
 * Stores categories by their ID.
 * @param {Object} [state={}] The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
const categoriesById = (state = {}, action) => {
  switch (action.type) {
    case REQUEST_CATEGORY:
      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          expires: 0,
          isFetching: true,
        },
      };

    case RECEIVE_CATEGORY: {
      const { children, ...categoryData } = action.categoryData;

      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          ...categoryData,
          expires: Date.now() + CATEGORY_LIFETIME,
          isFetching: false,
        },
        ...handleCategoryCollection(action.categoryChildren),
      };
    }

    case RECEIVE_ROOT_CATEGORIES:
      return {
        ...state,
        ...handleCategoryCollection(action.categories),
      };

    case RECEIVE_CATEGORY_CHILDREN:
      return {
        ...state,
        ...handleCategoryCollection(action.categoryChildren),
      };

    // TODO: improve the error handling here once CON-1329 is done
    case ERROR_CATEGORY:
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

export default categoriesById;
