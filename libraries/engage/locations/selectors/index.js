// @flow
import { createSelector, type Selector } from 'reselect';
import { getProduct } from '@shopgate/engage/product';
import { getUserData } from '@shopgate/engage/user';
import { isProductAvailable } from '../helpers';
import { PRODUCT_FULFILLMENT_METHOD_DIRECT_SHIP } from '../constants';
import { type State } from '../../types';
import {
  type LocationsState,
  type LocationsByIdState,
  type LocationsByProductIdState,
  type Location,
  type UserLocationState,
  type ReservationFormValues,
  type UserLocationFulfillmentMethod,
  type UserLocationLocationCode,
} from '../locations.types';

/**
 * Retrieves the locations state from the store.
 * @param {Object} state The current application state.
 * @return {Object} The locations state.
 */
function getLocationsState(state: State): LocationsState {
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
export function makeGetLocationsState(): Selector<State, LocationsByIdState> {
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
 * Creates the selector that retrieves the user location state.
 * @returns {Function}
 */
export function makeGetUserLocation(): Selector<State, UserLocationState> {
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
 * Creates the selector that retrieves the fulfillment method from the user location state.
 * @returns {Function}
 */
function makeGetUserLocationFulfillmentMethod(): Selector<State, UserLocationFulfillmentMethod> {
  const getUserLocation = makeGetUserLocation();
  return createSelector(
    getUserLocation,
    (userLocation) => {
      const { fulfillmentMethod = PRODUCT_FULFILLMENT_METHOD_DIRECT_SHIP } = userLocation || {};
      return fulfillmentMethod;
    }
  );
}

export { makeGetUserLocationFulfillmentMethod };

/**
 * Creates the selector that retrieves the location code from the user location state.
 * @returns {Function}
 */
export function makeGetUserLocationCode(): Selector<State, UserLocationLocationCode> {
  const getUserLocation = makeGetUserLocation();
  return createSelector(
    getUserLocation,
    (userLocation) => {
      const { code = null } = userLocation || {};
      return code;
    }
  );
}

/**
 * Creates the selector that retrieves the product locations state.
 * @returns {Function}
 */
export function makeGetProductLocationsState(): Selector<State, LocationsByProductIdState> {
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
export function makeGetLocation(): Selector<State, Location | null> {
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
export function makeGetProductLocations(): Selector<State, Location[] | null> {
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
 * @param {boolean} useUserLocation Whether the location code is taken from the userLocation state.
 * @returns {Function}
 */
export function makeGetProductLocation(
  useUserLocation: boolean = false
): Selector<State, Location | null> {
  const getProductLocationsState = makeGetProductLocationsState();
  const getLocationCodeSelector = useUserLocation
    ? makeGetUserLocationCode()
    : getLocationId;

  /**
   * Retrieves the locations for a specific product.
   * @param {Object} state The application state.
   * @param {Object} props The component props.
   * @param {string} props.productId The ID of the product to look for.
   * @returns {Array|null}
   */
  return createSelector(
    getProductLocationsState,
    getLocationCodeSelector,
    getProductId,
    (locationsState, locationId, productId) => {
      if (
        !productId ||
        !locationId ||
        !locationsState[productId] ||
        !Array.isArray(locationsState[productId].locations)
      ) {
        return null;
      }

      const { locations = [] } = locationsState[productId];
      return locations.find(l => l.code === locationId) || null;
    }
  );
}

/**
 * Creates the selector that determines, if products locations for a specific product are fetching.
 * @returns {Function}
 */
export function makeGetIsFetchingProductLocations(): Selector<State, boolean | null> {
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
export function makeGetFulfillmentMethods(): Selector<State, string[] | null> {
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
export function makeIsFulfillmentSelectorDisabled(): Selector<State, boolean> {
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
 * Creates a selector that retrieves the user's reserve form input.
 * @returns {Function}
 */
export function makeGetUserFormInput(): Selector<State, ReservationFormValues> {
  return createSelector(
    getLocationsState,
    getUserData,
    (locations, userData) => {
      if ((!locations || !locations.userFormInput) && !userData) {
        return null;
      }
      const { firstName, lastName, mail: email } = userData || {};
      const { userFormInput = {} } = locations || {};

      return {
        firstName,
        lastName,
        email,
        ...userFormInput,
      };
    }
  );
}

/**
 * Create a selector that retrieves the user's search query input.
 * @returns {Function}
 */
export function makeGetUserSearchQuery(): Selector<State, string> {
  return createSelector(
    getLocationsState,
    locations => locations.userSearchQuery
  );
}

/**
 * Creates a selector
 * @param {boolean} useUserLocation Whether the location code is taken from the userLocation state.
 * @returns {Function}
 */
export function makeIsRopeProductOrderable(
  useUserLocation: boolean = false
): Selector<State, boolean> {
  const getUserLocationFulfillmentMethod = makeGetUserLocationFulfillmentMethod();
  const getProductLocation = makeGetProductLocation(useUserLocation);

  return createSelector(
    getUserLocationFulfillmentMethod,
    getProductLocation,
    (userLocationFulfillmentMethod, productLocation) => {
      if (
        userLocationFulfillmentMethod === PRODUCT_FULFILLMENT_METHOD_DIRECT_SHIP
      ) {
        return null;
      }

      if (productLocation === null) {
        return false;
      }

      return isProductAvailable(productLocation);
    }
  );
}
