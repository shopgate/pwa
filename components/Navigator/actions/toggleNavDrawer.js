/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { toggleNavDrawer as toggleNavDrawerAction } from '../action-creators';
import { isNavDrawerActive } from '../selectors';

/**
 * Toggles the visibility of the navigation drawer.
 * @param {boolean} enabled Whether to show the navigation drawer.
 * @return {Function} A redux thunk.
 */
const toggleNavDrawer = enabled => (dispatch, getState) => {
  if (isNavDrawerActive(getState()) !== enabled) {
    dispatch(toggleNavDrawerAction(enabled));
  }
};

export default toggleNavDrawer;
