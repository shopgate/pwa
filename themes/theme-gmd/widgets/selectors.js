import { createSelector } from 'reselect';
import { generateResultHash } from '@shopgate/pwa-common/helpers/redux';
import { transformDisplayOptions } from '@shopgate/pwa-common/helpers/data';
import { getSortOrder } from '@shopgate/pwa-common/selectors/history';
import { getPopulatedProductsResult, getProductById } from '@shopgate/pwa-common-commerce/product/selectors/product';
import * as pipelines from '@shopgate/pwa-common-commerce/product/constants/Pipelines';

/**
 * Retrieves the result hash.
 * @param {Object} state The application state.
 * @param {number} type The query type.
 * @param {Object} params The query params.
 * @param {string} params.sort The sort order of the query.
 * @param {string} params.value The query parameters, depends on the query type.
 * @param {string} id A unique id for the component that is using this action.
 * @returns {string} The result hash.
 */
const getResultHash = (state, type, params, id) => {
  let hashParams = {};
  const currentSort = getSortOrder(state);
  const { value, sort = currentSort } = params;
  const transformedSort = transformDisplayOptions(sort);

  // Create the hash parameters based on the query type and parameters.
  switch (type) {
    // Product highlights
    case 1: {
      hashParams = {
        id,
        pipeline: pipelines.SHOPGATE_CATALOG_GET_HIGHLIGHT_PRODUCTS,
        sort: transformedSort,
      };

      break;
    }

    // Search phrase
    case 2:
    case 3: {
      hashParams = {
        id,
        searchPhrase: value,
        sort: transformedSort,
      };

      break;
    }

    // Product ID's
    case 4: {
      hashParams = {
        id,
        productIds: value,
        sort: transformedSort,
      };

      break;
    }

    // Category
    case 5: {
      hashParams = {
        id,
        categoryId: value,
        sort: transformedSort,
      };

      break;
    }
    default:
  }

  // Generate the hash string.
  return generateResultHash(hashParams, true, false);
};

/**
 * Retrieves the result by hash.
 * @param {Object} state The application state.
 * @param {Object} props The component props.
 * @returns {Object} The result.
 */
const getResultByHash = createSelector(
  state => state.product,
  getResultHash,
  (productState, hash) => productState.resultsByHash[hash]
);

/**
 * Retrieves the populated product result.
 * @param {Object} state The application state.
 * @param {Object} params The query parameters.
 * @returns {Object} The product result.
 */
export const getProductsResultWithHash = createSelector(
  state => state,
  getResultHash,
  getResultByHash,
  getPopulatedProductsResult
);

/**
 * @param {Object} state he application state.
 * @param {int} type Number indicating search type.
 * @param {Object} params Query parameters.
 * @param {string} id Id of component.
 * @return {Object} The product result.
 */
export const getProductsResultsWithIds = (state, type, params, id) => {
  const currentSort = getSortOrder(state);
  const { value: productIds = [], sort = currentSort } = params || {};
  let products = productIds.map(productId => (getProductById(state, productId) || {}).productData)
    || [];
  products = products.filter(product => typeof product !== 'undefined');
  const hash = getResultHash(state, type, params, id);
  return {
    products,
    totalProductCount: products.length,
    sort: transformDisplayOptions(sort),
    hash,
  };
};

/**
 * @param {Object} state he application state.
 * @param {int} type Number indicating search type.
 * @param {Object} params Query parameters.
 * @param {string} id Id of component.
 * @return {Object} The product result.
 */
export const getProductsResult = (state, type, params, id) => {
  if (type === 4) {
    return getProductsResultsWithIds(state, type, params, id);
  }

  return getProductsResultWithHash(state, type, params, id);
};

/**
 * Retrieves the populated product result.
 * @param {Object} state The application state.
 * @param {Object} params The query parameters.
 * @returns {Object} The product result.
 */
export const getProductsFetchingState = createSelector(
  state => state,
  getResultHash,
  getResultByHash,
  (state, hash, result) => (result ? result.isFetching : null)
);
