import { createSelector } from 'reselect';
import { getProductState } from './product';

/**
 * Creates the selector that retrieves the product locations state.
 * @returns {Function}
 */
export function makeGetProductLocationsState() {
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
 * Creates the selector that determines, if products locations for a specific product are fetching.
 * @returns {Function}
 */
export function makeGetIsFetchingProductLocations() {
  const getProductLocationsState = makeGetProductLocationsState();

  /**
   * Retrieves the isFetching state of locations for a specific product.
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

      const { isFetching = false } = locationsState[productId];

      return isFetching;
    }
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
