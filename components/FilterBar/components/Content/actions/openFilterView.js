/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import pushHistory from '@shopgate/pwa-common/actions/history/pushHistory';
import { FILTER_PATH } from '@shopgate/pwa-common-commerce/filter/constants';

/**
 * Opens the filter view and gives it the current filter hash.
 * @returns {Function} A redux thunk.
 */
const openFilterView = () => (dispatch, getState) => {
  const state = getState();

  dispatch(pushHistory({
    pathname: FILTER_PATH,
    params: {
      ...state.history.queryParams,
    },
  }));
};

export default openFilterView;
