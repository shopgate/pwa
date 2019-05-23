import { createSelector } from 'reselect';
import { generateResultHash } from '@shopgate/pwa-common/helpers/redux';
import { getProductState } from '@shopgate/engage/product';
import * as pipelines from '@shopgate/pwa-common-commerce/product/constants/Pipelines';
import { DEFAULT_SORT } from '@shopgate/engage/core';

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
 * Selects the liveshopping product ids.
 * @param {Object} state The application state.
 * @param {Object} props The component props.
 * @returns {Array|undefined}
 */
export const selectProductIds = createSelector(
  state => state,
  (state, props) => props,
  getResultHash,
  getResultByHash,
  (state, props, hash, result) => (
    (result && result.products) ? result.products : undefined
  )
);
