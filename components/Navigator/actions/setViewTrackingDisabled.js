/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { disableViewTracking } from '../action-creators';

/**
 * Disables view tracking if not already disabled.
 * @returns {Function} A redux thunk.
 */
const setViewTrackingDisabled = () => (dispatch, getState) => {
  const { navigator: { viewTracking } } = getState();

  if (viewTracking) {
    dispatch(disableViewTracking());
  }
};

export default setViewTrackingDisabled;
