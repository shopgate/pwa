import { createSelector } from 'reselect';
import { generateResultHash } from '@shopgate/pwa-common/helpers/redux';
import { getProductState } from '@shopgate/pwa-common-commerce/product/selectors/product';
import * as pipelines from '@shopgate/pwa-common-commerce/product/constants/Pipelines';
import { makeGetDefaultSortOrder } from '@shopgate/engage/filter';

/**
 * Retrieves the result hash.
 * @param {string} defaultSortOrder The default sort order
 * @returns {string} The result hash.
 */
const getResultHash = defaultSortOrder => generateResultHash({
  pipeline: pipelines.SHOPGATE_CATALOG_GET_LIVESHOPPING_PRODUCTS,
  sort: defaultSortOrder,
}, true, false);

const getDefaultSortOrder = makeGetDefaultSortOrder();

/**
 * Retrieves the result by hash.
 * @param {Object} state The application state.
 * @param {Object} props The component props.
 * @returns {Object} The result.
 */
const getResultByHash = createSelector(
  getProductState,
  getDefaultSortOrder,
  (productState, defaultSortOrder) => {
    const hash = getResultHash(defaultSortOrder);
    return productState.resultsByHash[hash];
  }
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
  getResultByHash,
  (state, props, result) => (
    (result && result.products) ? result.products : undefined
  )
);
