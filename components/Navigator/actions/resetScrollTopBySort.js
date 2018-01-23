/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { getSortOrder } from '@shopgate/pwa-common/selectors/history';
import setViewTop from 'Components/View/action-creators/setViewTop';

/**
 * Resets the view scroll position if the given sort order
 * is different from the currently set sort order.
 * @param {string} sortOrder The sort order to compare.
 * @return {Function} A redux thunk.
 */
const resetScrollTopBySort = sortOrder => (dispatch, getState) => {
  if (getSortOrder(getState()) !== sortOrder) {
    dispatch(setViewTop());
  }
};

export default resetScrollTopBySort;
