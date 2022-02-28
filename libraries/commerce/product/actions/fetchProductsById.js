import { getProductDataById } from '@shopgate/engage/product/selectors/product';
import { shouldFetchData } from '@shopgate/pwa-common/helpers/redux';
import fetchProducts from './fetchProducts';

/**
 * Retrieves products by id from the store.
 * @param {Array} productIds The product id's to request.
 * @param {string} [componentId=null] A unique id for the component that is using this action.
 * @param {boolean} [cached=true] cache result by hash
 * @param {boolean} [includeFulfillment=true] includes fulfillment
 * @return {Function} A Redux Thunk
 */
const fetchProductsById = (
  productIds, componentId = null, cached = true, includeFulfillment = true
) => (
  (dispatch, getState) => {
    const state = getState();
    const products = state.product.productsById;

    // Filter out only the products that are not yet available in the store.
    const missingIds = productIds.filter(id => shouldFetchData(products[id]));

    // Then only perform a pipeline request if there are products missing.
    if (!missingIds.length) {
      const productsById = productIds.map(id => getProductDataById(state, { productId: id }));
      const totalProductCount = productsById.length;
      return {
        products: productsById,
        totalProductCount,
      };
    }

    return dispatch(fetchProducts({
      ...componentId && { id: componentId },
      cached,
      params: {
        productIds: missingIds,
      },
      includeFulfillment,
      includeFilters: false,
      includeSort: false,
    }));
  }
);

export default fetchProductsById;
