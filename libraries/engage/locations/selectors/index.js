import { createSelector } from 'reselect';
import { getProductState, getProduct } from '@shopgate/engage/product';

/**
 * Creates the selector that retrieves the product locations state.
 * @returns {Function}
 */
function makeGetProductLocationsState() {
  /**
   * Retrieves the product locations state.
   * @param {Object} state The application state.
   * @returns {Object}
   */
  return createSelector(
    getProductState,
    state => state.locationsByProductId || {}
  );
}

/**
 * Creates the selector that returns the locations for a specific product.
 * @returns {Function}
 */
export function makeGetProductLocations() {
  const getProductLocationsState = makeGetProductLocationsState();

  /**
   * Retrieves the locations for a specific product.
   * @param {Object} state The application state.
   * @param {Object} props The component props.
   * @param {string} props.productId The ID of the product to look for.
   * @returns {Array|null}
   */
  return createSelector(
    getProductLocationsState,
    (state, props) => props.productId || null,
    (locationsState, productId) => {
      if (!productId || !locationsState[productId]) {
        return null;
      }

      const { locations = [] } = locationsState[productId];

      return locations;
    }
  );
}

/**
 * Creates a selector to retriev a product's fulfillment methods.
 * @returns {Function}
 */
export function makeGetFulfillmentMethods() {
  return createSelector(
    getProduct,
    (product) => {
      if (!product || !product.fulfillmentMethods || product.fulfillmentMethods.length === 0) {
        return null;
      }

      return product.fulfillmentMethods;
    }
  );
}
