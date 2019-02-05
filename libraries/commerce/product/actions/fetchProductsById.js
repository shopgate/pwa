import { shouldFetchData } from '@shopgate/pwa-common/helpers/redux';
import fetchProducts from './fetchProducts';

/**
 * Retrieves products by id from the store.
 * @param {Array} productIds The product id's to request.
 * @param {string} [componentId=null] A unique id for the component that is using this action.
 * @return {Function} A Redux Thunk
 */
const fetchProductsById = (productIds, componentId = null) => (dispatch, getState) => {
  const state = getState();
  const products = state.product.productsById;

  // Filter out only the products that are not yet available in the store.
  const missingIds = productIds.filter(id => shouldFetchData(products[id]));

  // Then only perform a pipeline request if there are products missing.
  if (!missingIds.length) {
    return;
  }

  dispatch(fetchProducts({
    ...componentId && { id: componentId },
    params: {
      productIds: missingIds,
    },
    includeFilters: false,
    includeSort: false,
  }));
};

export default fetchProductsById;
