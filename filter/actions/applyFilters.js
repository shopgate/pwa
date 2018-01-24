/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import goBackHistory from '@shopgate/pwa-common/actions/history/goBackHistory';
import { getHistoryPathname } from '@shopgate/pwa-common/selectors/history';
import commitTemporaryFilters from './commitTemporaryFilters';
import { FILTER_PATH } from '../constants';

/**
 * Applies the filters to the products and navigates back to the previous route containing products.
 * @returns {Function} A redux thunk
 */
const applyFilters = () => (dispatch, getState) => {
  dispatch(commitTemporaryFilters());

  const path = getHistoryPathname(getState());

  if (path.startsWith(`${FILTER_PATH}/`)) {
    dispatch(goBackHistory(2));
  } else if (path.startsWith(FILTER_PATH)) {
    dispatch(goBackHistory(1));
  }
};

export default applyFilters;
