/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { enableTitle } from '../action-creators';
import { isTitleShowing } from '../selectors';

/**
 * Enables the Navigator's title.
 * @return {Function} A redux thunk.
 */
const enableNavigatorTitle = () => (dispatch, getState) => {
  if (!isTitleShowing(getState())) {
    dispatch(enableTitle());
  }
};

export default enableNavigatorTitle;
