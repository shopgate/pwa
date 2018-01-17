/**
 * Copyright (c) 2018, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  unsetLoading,
  decrementLoading,
} from '../../action-creators/view';
import { getLoadingViews } from '../../selectors/view';

/**
 * Toggles the visibility of the loading bar for a pathname.
 * @param {boolean} pathname The pathname to set to be not loading.
 * @return {Function} A redux thunk.
 */
const unsetViewLoading = pathname => (dispatch, getState) => {
  const loadingViews = getLoadingViews(getState());

  if (!Object.keys(loadingViews).includes(pathname)) {
    return;
  }

  if (loadingViews[pathname] > 1) {
    dispatch(decrementLoading(pathname));
  } else {
    dispatch(unsetLoading(pathname));
  }
};

export default unsetViewLoading;
