/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import pushHistory from '@shopgate/pwa-common/actions/history/pushHistory';
import { FILTER_PATH } from '@shopgate/pwa-common-commerce/filter/constants';
import { getFilterHash } from '@shopgate/pwa-common-commerce/filter/selectors';

/**
 * Opens the filter view and gives it the current filter hash.
 * @param {Object} props The components props.
 * @returns {Function} A redux thunk.
 */
const openFilterView = props => (dispatch, getState) => {
  const state = getState();
  const filterHash = getFilterHash(state, props);

  dispatch(pushHistory({
    pathname: FILTER_PATH,
    params: {
      ...state.history.queryParams,
    },
    state: {
      filterHash,
    },
  }));
};

export default openFilterView;
