/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import replaceHistory from '@shopgate/pwa-common/actions/history/replaceHistory';

/**
 * Updates the sort parameter in the history.
 * @param {string} sort The sort order
 * @returns {Function} A redux thunk.
 */
const changeSortOrder = sort => (dispatch, getState) => {
  const { history } = getState();
  const params = {
    ...history.queryParams,
    sort,
  };

  dispatch(replaceHistory({ params }));
};

export default changeSortOrder;
