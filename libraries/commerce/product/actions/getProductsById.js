import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import { generateResultHash, shouldFetchData } from '@shopgate/pwa-common/helpers/redux';
import { getSortOrder } from '@shopgate/pwa-common/selectors/history';
import * as pipelines from '../constants/Pipelines';
import requestProducts from '../action-creators/requestProducts';
import receiveProducts from '../action-creators/receiveProducts';
import errorProducts from '../action-creators/errorProducts';
import { getActiveFilters } from '../../filter/selectors';

/**
 * Gets products that are already cached in state
 * @param {Array} productIds The product id's that are already cached
 * @param {Object} state application state
 * @return {Array} Array of product objects
 */
const getProductsFromStateById = (productIds, state) => {
  const stateProducts = state.product.productsById;
  return productIds.map(id => stateProducts[id].productData);
};

/**
 * Retrieves products by id from the store.
 * @param {Array} productIds The product id's to request.
 * @param {string} [componentId=null] A unique id for the component that is using this action.
 * @return {Function} A Redux Thunk
 */
const getProductsById = (productIds, componentId = null) => (dispatch, getState) => {
  const state = getState();
  const pipeline = pipelines.SHOPGATE_CATALOG_GET_PRODUCTS;
  const sort = getSortOrder(state);
  const filters = getActiveFilters(state);

  const hash = generateResultHash({
    pipeline,
    sort,
    productIds,
    ...(filters && Object.keys(filters).length) && { filters },
    ...componentId && { id: componentId },
  }, false, false);

  const result = state.product.resultsByHash[hash];

  // Stop if we don't need to get any data.
  if (!shouldFetchData(result, 'products')) {
    const { products } = result;

    if (Array.isArray(products)) {
      return Promise.resolve(result);
    }

    return null;
  }

  // Filter out only the products that are not yet available in the store.
  const missingIds = productIds.filter(id => shouldFetchData(state.product.productsById[id]));

  dispatch(requestProducts({
    hash,
    productIds,
  }));

  // Dispatch receiveProducts with updated hash and the cached products
  if (!missingIds.length) {
    const products = getProductsFromStateById(productIds, state);

    return Promise.resolve({ products }).then((response) => {
      dispatch(receiveProducts({
        hash,
        productIds,
        products,
        totalResultCount: products.length,
        cached: true,
      }));
      return response;
    });
  }

  // Then only perform a pipeline request if there are products missing.
  const cachedIds = productIds.filter(id => !shouldFetchData(state.product.productsById[id]));
  return new PipelineRequest(pipeline)
    .setInput({ productIds: missingIds })
    .dispatch()
    .then((response) => {
      let products = getProductsFromStateById(cachedIds, state);
      products = products.concat(response.products);
      dispatch(receiveProducts({
        hash,
        productIds,
        products,
        totalResultCount: products.length,
        cached: true,
      }));

      return response;
    })
    .catch((error) => {
      logger.error(error);
      dispatch(errorProducts({
        hash,
        productIds,
      }));

      return error;
    });
};

export default getProductsById;
