/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { setTextColor } from '../action-creators';
import { getTextColor } from '../selectors';

/**
 * Sets the color of the Navigator's text.
 * @param {string} color The new text color of the navigator.
 * @return {Function} A redux thunk.
 */
const setNavigatorColor = color => (dispatch, getState) => {
  if (getTextColor(getState()) !== color) {
    dispatch(setTextColor(color));
  }
};

export default setNavigatorColor;
