/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { toggleSearch } from '../action-creators';
import { isNavSearchFieldActive } from '../selectors';

/**
 * Toggles the visibility of the navigation drawer.
 * @param {boolean} value Whether to show the navigation search field.
 * @return {Function} A redux thunk.
 */
const toggleNavSearchField = value => (dispatch, getState) => {
  if (isNavSearchFieldActive(getState()) !== value) {
    dispatch(toggleSearch(value));
  }
};

export default toggleNavSearchField;
