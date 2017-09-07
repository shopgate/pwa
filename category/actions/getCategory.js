/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fetchRootCategories from './fetchRootCategories';
import fetchCategory from './fetchCategory';

/**
 * Retrieves a category from store.
 * @param {string} categoryId The category ID.
 * @return {Function} The dispatched action.
 */
const getCategory = categoryId => (dispatch) => {
  if (!categoryId) {
    dispatch(fetchRootCategories());
    return;
  }

  dispatch(fetchCategory(categoryId));
};

export default getCategory;
