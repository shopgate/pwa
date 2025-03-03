import { createSelector } from 'reselect';
import {
  generateResultHash,
} from '@shopgate/engage/core/helpers';
import {
  getProductState,
} from '@shopgate/engage/product/selectors/product';
import {
  SHOPGATE_CATALOG_GET_LIVESHOPPING_PRODUCTS,
} from '@shopgate/engage/product/constants';

/**
 * Retrieves the result hash.
 * @returns {string} The result hash.
 */
const getResultHash = () => generateResultHash({
  pipeline: SHOPGATE_CATALOG_GET_LIVESHOPPING_PRODUCTS,
}, false, false);

/**
 * Retrieves the result by hash.
 * @param {Object} state The application state.
 * @param {Object} props The component props.
 * @returns {Object} The result.
 */
const getResultByHash = createSelector(
  getProductState,
  (productState) => {
    const hash = getResultHash();
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
