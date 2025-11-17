import { getProductDataById } from '@shopgate/engage/product/selectors/product';
import { shouldFetchData } from '@shopgate/pwa-common/helpers/redux';
import fetchProducts, { isProductIdentifiersProductIdType } from './fetchProducts';

/**
 * Dispatches a fetch products action to retrieve products by their IDs.
 * @param {Object|string[]} optionsOrProductIds Action options or an array of product IDs
 * (deprecated)
 * @param {string[]} params.productIds The product id's to request
 * @param {string} [params.componentId=null] A unique id for the component that is using this action
 * @param {boolean} [params.cached=true] Whether to cache the result by hash
 * @param {boolean} [params.includeFulfillment=true] Whether to include fulfillment data to the
 * request
 *
 * @param {string} [componentId=null] (deprecated) A unique id for the component that is using this
 * action
 * @param {boolean} [cached=true] (deprecated) Whether to cache the result by hash
 * @param {boolean} [includeFulfillment=true] (deprecated) Whether to include fulfillment data to
 * the request
 * @return {Function} A Redux Thunk
 */
const fetchProductsById = (
  optionsOrProductIds,
  componentId = null,
  cached = true,
  includeFulfillment = true
) => (
  (dispatch, getState) => {
    let localProductIds;
    let localComponentId;
    let localCached;
    let localIncludeFulfillment;
    let productIdType;

    if (Array.isArray(optionsOrProductIds)) {
      // Backwards compatibility for previous implementation where the function had a parameter list
      localProductIds = optionsOrProductIds;
      localComponentId = componentId || null;
      localCached = cached !== undefined ? cached : true;
      localIncludeFulfillment = includeFulfillment !== undefined ? includeFulfillment : true;
    } else if (typeof optionsOrProductIds === 'object' && optionsOrProductIds !== null) {
      // New object parameter mode
      ({
        productIds: localProductIds,
        componentId: localComponentId = null,
        cached: localCached = true,
        includeFulfillment: localIncludeFulfillment = true,
        productIdType,
      } = optionsOrProductIds);
    }

    let requestProductIds = localProductIds;

    // When the productIds are regular product IDs, we can check the Redux store for existing
    // and only request the missing ones. That certainly doesn't work for SKUs, EANs or UPCs,
    if (!isProductIdentifiersProductIdType(productIdType)) {
      const state = getState();
      const products = state.product.productsById;

      // Filter out only the products that are not yet available in the store.
      requestProductIds = localProductIds.filter(id => shouldFetchData(products[id]));

      // Then only perform a pipeline request if there are products missing.
      if (!requestProductIds.length) {
        const productsById = localProductIds.map(
          id => getProductDataById(state, { productId: id })
        );
        const totalProductCount = productsById.length;
        return {
          products: productsById,
          totalProductCount,
        };
      }
    }

    return dispatch(fetchProducts({
      ...localComponentId && { id: localComponentId },
      cached: localCached,
      params: {
        productIds: requestProductIds,
        ...productIdType && { productIdType },
      },
      includeFulfillment: localIncludeFulfillment,
      includeFilters: false,
      includeSort: false,
      calledByFetchProductsById: true,
    }));
  }
);

export default fetchProductsById;
