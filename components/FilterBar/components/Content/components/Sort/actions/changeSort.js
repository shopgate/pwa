/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import changeSortOrder from '@shopgate/pwa-common-commerce/product/actions/changeSortOrder';
import { getSortOrder } from '@shopgate/pwa-common/selectors/history';
import getProducts from 'Pages/Category/components/Products/actions/getProducts';
import setViewTop from 'Components/View/action-creators/setViewTop';

/**
 * Changes the sort order of the products.
 * @param {string} newSort The new sort order value.
 * @return {Function} A redux thunk.
 */
const changeSort = newSort => (dispatch, getState) => {
  const state = getState();
  const oldSort = getSortOrder(state);

  if (newSort === oldSort) {
    return;
  }

  // Change the sort order
  dispatch(changeSortOrder(newSort));

  // Fetch new products.
  dispatch(getProducts());

  // Reset the scroll top position of the page.
  dispatch(setViewTop(true));
};

export default changeSort;
