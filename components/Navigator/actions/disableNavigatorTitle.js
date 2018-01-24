/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { disableTitle } from '../action-creators';
import { isTitleShowing } from '../selectors';

/**
 * Disables the Navigator's title.
 * @return {Function} A redux thunk.
 */
const disableNavigatorTitle = () => (dispatch, getState) => {
  if (isTitleShowing(getState())) {
    dispatch(disableTitle());
  }
};

export default disableNavigatorTitle;
