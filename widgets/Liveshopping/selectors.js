import { createSelector } from 'reselect';
import { generateResultHash } from '@shopgate/pwa-common/helpers/redux';
import { getSortOrder } from '@shopgate/pwa-common/selectors/history';
import { getPopulatedProductsResult } from '@shopgate/pwa-common-commerce/product/selectors/product';
import * as pipelines from '@shopgate/pwa-common-commerce/product/constants/Pipelines';

/**
 * Retrieves the result hash.
 * @param {Object} state The application state.
 * @returns {string} The result hash.
 */
const getResultHash = state => generateResultHash({
  pipeline: pipelines.SHOPGATE_CATALOG_GET_LIVESHOPPING_PRODUCTS,
  sort: getSortOrder(state),
}, true, false);

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
 * @param {Object} props The component props.
 * @returns {Object} The product result.
 */
export const getProductsResult = createSelector(
  state => state,
  getResultHash,
  getResultByHash,
  getPopulatedProductsResult
);
