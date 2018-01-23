/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  setLoading,
  incrementLoading,
} from '../../action-creators/view';
import { getLoadingViews } from '../../selectors/view';

/**
 * Toggles the visibility of the loading bar for a pathname.
 * @param {boolean} pathname The pathname to set to be loading.
 * @return {Function} A redux thunk.
 */
const setViewLoading = pathname => (dispatch, getState) => {
  const loadingViews = getLoadingViews(getState());

  if (!Object.keys(loadingViews).includes(pathname)) {
    dispatch(setLoading(pathname));
  } else {
    dispatch(incrementLoading(pathname));
  }
};

export default setViewLoading;
