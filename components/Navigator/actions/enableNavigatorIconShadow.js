/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { enableIconShadow } from '../action-creators';
import { isIconShadowShowing } from '../selectors';

/**
 * Enables the shadow on the Navigator's icons.
 * @return {Function} A redux thunk.
 */
const enableNavigatorIconShadow = () => (dispatch, getState) => {
  if (!isIconShadowShowing(getState())) {
    dispatch(enableIconShadow());
  }
};

export default enableNavigatorIconShadow;
