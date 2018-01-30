/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { enableViewTracking } from '../action-creators';

/**
 * Enable view tracking if not already enabled.
 * @returns {Function} A redux thunk.
 */
const setViewTrackingEnabled = () => (dispatch, getState) => {
  const { navigator: { viewTracking } } = getState();

  if (!viewTracking) {
    dispatch(enableViewTracking());
  }
};

export default setViewTrackingEnabled;
