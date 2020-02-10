import { createSelector } from 'reselect';
import { getProduct } from '@shopgate/engage/product';

/**
 * Retrieves the locations state from the store.
 * @param {Object} state The current application state.
 * @return {Object} The locations state.
 */
function getLocationsState(state) {
  return state.locations || {};
}

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
    getLocationsState,
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
  /**
   * Retrieves a product's fulfillment methods.
   * @param {Object} state The application state.
   * @param {Object} props The component props.
   * @param {string} props.productId The ID of the product to look for.
   * @returns {Array|null}
   */
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

/**
 * Creates a selector that checks if the Fulfillment Selector should be disabled.
 * @returns {Function}
 */
export function makeIsFulfillmentSelectorDisabled() {
  const getProductLocations = makeGetProductLocations();
  const getFulfillmentMethods = makeGetFulfillmentMethods();

  /**
   * Retrieves whether the Fulfillment Selector should be disabled.
   * @param {Object} state The application state.
   * @param {Object} props The component props.
   * @param {string} props.productId The ID of the product to look for.
   * @returns {boolean}
   */
  return createSelector(
    getProductLocations,
    getFulfillmentMethods,
    (locations, methods) => {
      if (methods && (!locations || locations.length === 0)) {
        return true;
      }

      return false;
    }
  );
}

/**
 * Creates the selector that retrieves the user location state.
 * @returns {Function}
 */
export function makeGetUserLocation() {
  return createSelector(
    getLocationsState,
    (locations) => {
      if (!locations || !locations.userLocation) {
        return null;
      }

      return locations.userLocation;
    }
  );
}

/**
 * Creates a selector that retrieves the user's reserve form input.
 * @returns {Function}
 */
export function makeGetUserFormInput() {
  return createSelector(
    getLocationsState,
    (locations) => {
      if (!locations || !locations.userFormInput) {
        return null;
      }

      return locations.userFormInput;
    }
  );
}
