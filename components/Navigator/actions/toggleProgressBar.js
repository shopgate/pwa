/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { toggleProgressBar as toggleProgressBarAction } from '../action-creators';
import { isProgressBarShowing } from '../selectors';

/**
 * Toggles the visibility of the navigation progress bar.
 * @param {boolean} isActive Whether or not to activate the progress bar.
 * @return {Function} A redux thunk.
 */
const toggleProgressBar = isActive => (dispatch, getState) => {
  if (isProgressBarShowing(getState()) !== isActive) {
    dispatch(toggleProgressBarAction(isActive));
  }
};

export default toggleProgressBar;
