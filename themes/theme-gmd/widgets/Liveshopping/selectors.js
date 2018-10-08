import { createSelector } from 'reselect';
import { generateResultHash } from '@shopgate/pwa-common/helpers/redux';
import {
  getProductState,
  getPopulatedProductsResult,
} from '@shopgate/pwa-common-commerce/product/selectors/product';
import * as pipelines from '@shopgate/pwa-common-commerce/product/constants/Pipelines';
import { DEFAULT_SORT } from '@shopgate/pwa-common/constants/DisplayOptions';

/**
 * Retrieves the result hash.
 * @returns {string} The result hash.
 */
const getResultHash = () => generateResultHash({
  pipeline: pipelines.SHOPGATE_CATALOG_GET_LIVESHOPPING_PRODUCTS,
  sort: DEFAULT_SORT,
}, true, false);

/**
 * Retrieves the result by hash.
 * @param {Object} state The application state.
 * @param {Object} props The component props.
 * @returns {Object} The result.
 */
const getResultByHash = createSelector(
  getProductState,
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
  (state, props) => props,
  getResultHash,
  getResultByHash,
  getPopulatedProductsResult
);
