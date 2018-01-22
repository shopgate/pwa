/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fetchCategoryProducts from '@shopgate/pwa-common-commerce/category/actions/fetchCategoryProducts';
import getSearchResults from '@shopgate/pwa-common-commerce/search/actions/getSearchResults';
import { getHistoryPathname } from '@shopgate/pwa-common/selectors/history';
import { CATEGORY_PATH } from '@shopgate/pwa-common-commerce/category/constants';
import { SEARCH_PATH } from '@shopgate/pwa-common-commerce/search/constants';

/**
 * Call the correct action to retrieve products based on which route we are currently on.
 * @param {number} offset The result offset for the pipeline.
 * @return {Function} A redux thunk.
 */
const getProducts = (offset = 0) => (dispatch, getState) => {
  const pathname = getHistoryPathname(getState());

  if (pathname.startsWith(CATEGORY_PATH)) {
    dispatch(fetchCategoryProducts(offset));
  } else if (pathname.startsWith(SEARCH_PATH)) {
    dispatch(getSearchResults(offset));
  }
};

export default getProducts;
