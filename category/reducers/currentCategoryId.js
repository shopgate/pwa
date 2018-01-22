/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { SET_CURRENT_CATEGORY_ID } from '../constants';
/**
 * Stores the current category id.
 * @param {Object} [state=null] The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
const currentCategoryId = (state = null, action) => {
  switch (action.type) {
    case SET_CURRENT_CATEGORY_ID:
      return action.categoryId || null;

    default:
      return state;
  }
};

export default currentCategoryId;
