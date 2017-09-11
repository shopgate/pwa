/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ITEMS_PER_LOAD } from '@shopgate/pwa-common/constants/DisplayOptions';
import { getSortOrder } from '@shopgate/pwa-common/selectors/history';
import getProducts from '../../product/actions/getProducts';
import { getSearchPhrase } from '../selectors';

/**
 * Retrieves products for a certain search query.
 * @param {number} offset The offset for the products to request.
 * @return {Function} The dispatched action.
 */
export const getSearchResults = (offset = 0) => (dispatch, getState) => {
  const state = getState();
  const sort = getSortOrder(state);
  const limit = ITEMS_PER_LOAD;
  const searchPhrase = getSearchPhrase(state).trim();

  if (!searchPhrase) {
    return;
  }

  dispatch(
    getProducts({
      params: {
        searchPhrase,
        offset,
        limit,
        sort,
      },
    })
  );
};
