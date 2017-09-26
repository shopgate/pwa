/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  CATEGORY_LIFETIME,
  REQUEST_ROOT_CATEGORIES,
  RECEIVE_ROOT_CATEGORIES,
  ERROR_ROOT_CATEGORIES,
} from '../constants';
import handleReceivedCategories from './helpers/handleReceivedCategories';

/**
 * Stores a collection of category IDs that represent the
 * highest level of categories with no parent.
 * @param {Object} [state={}] The current application state.
 * @param {Object} action The action object.
 * @return {Object} The store data.
 */
const rootCategories = (state = {}, action) => {
  switch (action.type) {
    case REQUEST_ROOT_CATEGORIES:
      return {
        ...state,
        categories: null,
        expires: 0,
        isFetching: true,
      };

    case RECEIVE_ROOT_CATEGORIES:
      return {
        ...state,
        categories: handleReceivedCategories(action.categories),
        expires: Date.now() + CATEGORY_LIFETIME,
        isFetching: false,
      };

    case ERROR_ROOT_CATEGORIES:
      return {
        ...state,
        isFetching: false,
      };

    default:
      return state;
  }
};

export default rootCategories;
