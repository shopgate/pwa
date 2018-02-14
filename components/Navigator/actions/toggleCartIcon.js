/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { isCartButtonVisible } from '../selectors';
import { toggleCartIcon as toggleNavigatorCartIcon } from '../action-creators';

/**
 * Toggles the visibility of the cart icon.
 * @param {boolean} value Whether to show the cart icon.
 * @return {Function} A redux thunk.
 */
const toggleCartIcon = value => (dispatch, getState) => {
  if (isCartButtonVisible(getState()) !== value) {
    dispatch(toggleNavigatorCartIcon(value));
  }
};

export default toggleCartIcon;
