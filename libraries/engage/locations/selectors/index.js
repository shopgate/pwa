// @flow
import { createSelector, type Selector } from 'reselect';
import { getProduct } from '@shopgate/engage/product';
import { getUserData, getExternalCustomerNumber, getUserId } from '@shopgate/engage/user';
import { makeGetEnabledFulfillmentMethods } from '../../core';
import { isProductAvailable } from '../helpers/productInventory';
import { DIRECT_SHIP } from '../constants';
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
import { type UserSearchStateType } from '../reducers/userSearch';

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
export function makeGetUserLocationFulfillmentMethod():
  Selector<State, UserLocationFulfillmentMethod> {
  const getUserLocation = makeGetUserLocation();
  return createSelector(
    getUserLocation,
    (userLocation) => {
      const { fulfillmentMethod = null } = userLocation || {};
      return fulfillmentMethod;
    }
  );
}

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
 * Creates the selector that retrieves the user location address,
 * @returns {Function}
 */
export function makeGetUserLocationAddress() {
  const getUserLocationCode = makeGetUserLocationCode();
  const getLocationsById = makeGetLocationsState();

  return createSelector(
    getLocationsById,
    getUserLocationCode,
    (locationsState, code) => {
      if (!locationsState || !code) {
        return null;
      }

      return locationsState[code].address || null;
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
export function makeGetProductFulfillmentMethods(): Selector<State, string[] | null> {
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
 * @param {string} fulfillmentMethod The fulfillment method to check.
 * @returns {Function}
 */
export function makeIsFulfillmentSelectorMethodEnabled(fulfillmentMethod: string) {
  const getProductLocations = makeGetProductLocations();
  const getProductFulfillmentMethods = makeGetProductFulfillmentMethods();
  const getMerchantFulfillmentMethods = makeGetEnabledFulfillmentMethods();

  /**
   * Retrieves whether the Fulfillment Selector for a specific method should be disabled.
   * @param {Object} state The application state.
   * @param {Object} props The component props.
   * @param {string} props.productId The ID of the product to look for.
   * @returns {boolean}
   */
  return createSelector(
    getProductLocations,
    getMerchantFulfillmentMethods,
    getProductFulfillmentMethods,
    (locations, merchantMethods, productMethods) => {
      const hasLocations = Array.isArray(locations) && locations.length > 0;
      const methodSupported =
        Array.isArray(merchantMethods) &&
        merchantMethods.includes(fulfillmentMethod) &&
        Array.isArray(productMethods) &&
        productMethods.includes(fulfillmentMethod);

      if (fulfillmentMethod === DIRECT_SHIP && methodSupported) {
        return true;
      }

      if (!hasLocations || !methodSupported) {
        return false;
      }

      return true;
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
 * Create a selector that retrieves the user's search.
 * @returns {Function}
 */
export function makeGetUserSearch(): Selector<State, UserSearchStateType> {
  return createSelector(
    getLocationsState,
    locations => locations.userSearch || {}
  );
}

/**
 * Create a selector that retrieves the postal code from the user's search.
 * @returns {Function}
 */
export function makeGetUserSearchPostalCode(): Selector<State, string | null> {
  const getUserSearch = makeGetUserSearch();

  /**
  * Retrieves the postal code from the user's search.
  * @param {Object} state The application state.
  * @param {Object} props The component props.
  * @returns {string|null}
  */
  return createSelector(
    getUserSearch,
    userSearch => userSearch.postalCode
  );
}

/**
 * Create a selector that retrieves the country code from the user's search.
 * @returns {Function}
 */
export function makeGetUserSearchCountryCode(): Selector<State, string> {
  const getUserSearch = makeGetUserSearch();

  /**
  * Retrieves the country code from the user's search.
  * @param {Object} state The application state.
  * @param {Object} props The component props.
  * @returns {string}
  */
  return createSelector(
    getUserSearch,
    userSearch => userSearch.countryCode || ''
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
        userLocationFulfillmentMethod === DIRECT_SHIP
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

/**
 * Returns the externalCustomerNumber that is used to create a new order.
 */
export const getExternalCustomerNumberForOrder = createSelector(
  getUserId,
  getExternalCustomerNumber,
  (id, externalCustomerNumber) => {
    if (externalCustomerNumber) {
      return externalCustomerNumber.toString();
    }

    if (id) {
      return id.toString();
    }

    return undefined;
  }
);
