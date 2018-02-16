/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import setViewTitle from '../action-creators/setViewTitle';
import { getTitle } from '../selectors';

/**
 * Sets the title of the Navigator.
 * @param {string} title The title text for the navigator.
 * @return {Function} A redux thunk.
 */
const setTitle = title => (dispatch, getState) => {
  if (getTitle(getState()) !== title) {
    dispatch(setViewTitle(title));
  }
};

export default setTitle;
