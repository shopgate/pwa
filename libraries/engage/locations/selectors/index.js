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
 * Determines the currently relevant productId from the props.
 * @param {Object} state The application state.
 * @param {Object} props The component props.
 * @param {string} props.productId The ID of a product (simple product id or parent product id)
 * @param {string} props.variantId The ID of a variant.
 * @returns {string|null}
 */
function getProductId(state, props) {
  return props.variantId || props.productId || null;
}

/**
 * Determines the currently relevant locationId from the props.
 * @param {Object} state The application state.
 * @param {Object} props The component props.
 * @param {string} props.locationId The ID of the location
 * @returns {string|null}
 */
function getLocationId(state, props) {
  return props.locationId || null;
}

/**
 * Creates the selector that retrieves the locations state.
 * @returns {Function}
 */
export function makeGetLocationsState() {
  /**
   * Retrieves the product locations state.
   * @param {Object} state The application state.
   * @returns {Object}
   */
  return createSelector(
    getLocationsState,
    state => state.locationsById || {}
  );
}

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
    getLocationsState,
    state => state.locationsByProductId || {}
  );
}

/**
 * Creates the selector that returns the location.
 * @returns {Function}
 */
export function makeGetLocation() {
  const getLocationsStateSelector = makeGetLocationsState();

  /**
   * Retrieves the locations.
   * @param {Object} state The application state.
   * @param {Object} props The component props.
   * @param {string} props.code The ID of the location.
   * @returns {Array|null}
   */
  return createSelector(
    getLocationsStateSelector,
    getLocationId,
    (locationsState, locationId) => {
      if (!locationId) {
        return null;
      }
      return locationsState[locationId] || null;
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
    getProductId,
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
 * Creates the selector that returns the single product location.
 * @returns {Function}
 */
export function makeGetProductLocation() {
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
    getLocationId,
    getProductId,
    (locationsState, locationId, productId) => {
      if (!productId || !locationId || !locationsState[productId]) {
        return null;
      }

      return locationsState[productId].locations.find(l => l.code === locationId);
    }
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
    getProductId,
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
 * Creates a selector to retrieve a product's fulfillment methods.
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
      if (!methods || !locations || !locations.length === 0) {
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
