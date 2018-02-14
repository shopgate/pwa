/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { enable } from '../action-creators';
import { isEnabled } from '../selectors';

/**
 * Disables the navigator.
 * @return {Function} A redux thunk.
 */
const enableNavigator = () => (dispatch, getState) => {
  if (!isEnabled(getState())) {
    dispatch(enable());
  }
};

export default enableNavigator;
