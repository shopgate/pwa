/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { shouldFetchData } from '@shopgate/pwa-common/helpers/redux';
import getProducts from './getProducts';

/**
 * Retrieves products by id from the store.
 * @param {string} productIds The product id's to request.
 * @param {string} [componentId=null] A unique id for the component that is using this action.
 * @return {Function} A Redux Thunk
 */
const getProductsById = (productIds, componentId = null) => (dispatch, getState) => {
  const state = getState();
  const products = state.product.productsById;

  // Filter out only the products that are not yet available in the store.
  const missingIds = productIds.filter(id => shouldFetchData(products[id]));

  // Then only perform a pipeline request if there are products missing.
  if (!missingIds.length) {
    return;
  }

  dispatch(getProducts({
    ...componentId && { id: componentId },
    params: {
      productIds: missingIds,
    },
    includeFilters: false,
    includeSort: false,
  }));
};

export default getProductsById;
