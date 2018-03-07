/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { combineReducers } from 'redux';
import rootCategories from './rootCategories';
import categoriesById from './categoriesById';
import childrenByCategoryId from './childrenByCategoryId';
import currentCategoryId from './currentCategoryId';

/**
 * The category reducer.
 */
export default combineReducers({
  rootCategories,
  categoriesById,
  childrenByCategoryId,
  currentCategoryId,
});
