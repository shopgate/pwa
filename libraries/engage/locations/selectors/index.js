import { createSelector } from 'reselect';
import pickBy from 'lodash/pickBy';
import { getUserData, getExternalCustomerNumber, getUserId } from '@shopgate/engage/user';
import { generateSortedHash } from '@shopgate/pwa-common/helpers/redux/generateSortedHash';
import { getProduct } from '@shopgate/engage/product/selectors/product';
import { getCurrentRoute } from '@shopgate/pwa-common/selectors/router';
import { getIsLocationBasedShopping, makeUseLocationFulfillmentMethods } from '@shopgate/engage/core';
import { makeGetEnabledFulfillmentMethods } from '../../core/config';
import { makeIsProductActive, makeIsBaseProductActive } from '../../product/selectors/product';
import { isProductAvailable } from '../helpers/productInventory';
import { DIRECT_SHIP } from '../constants';

/**
 * Selector to retrieve a product's fulfillment methods.
 * @returns {Function}
 */
export const getProductFulfillmentMethods = createSelector(
  getProduct,
  (product) => {
    if (!product || !product.fulfillmentMethods || product.fulfillmentMethods.length === 0) {
      return null;
    }

    return product.fulfillmentMethods;
  }
);

/**
 * Gets the location state.
 * @param {Object} state State.
 * @return {Object}
 */
const getLocationsState = state => state.locations || {};

/**
 * Gets the location storage state.
 * @param {Object} state State.
 * @return {Object}
 */
export const getLocationsStorage = state => state.locations.storage;

/**
 * Retrieves the store finder search.
 * @param {Object} state State.
 * @returns {Object}
 */
export const getStoreFinderSearch = (state) => {
  const locationState = getLocationsState(state);
  return locationState.storeFinderSearch;
};

/**
 * Retrieves the store finder search radius.
 * @param {Object} state State.
 * @returns {Object}
 */
export const getStoreFinderSearchRadius = createSelector(
  getStoreFinderSearch,
  search => search.radius || null
);

/**
 * Creates a selector that retrieves a filtered list of locations
 * @param {Function} getFilters Has to retrieve the filters.
 * @returns {Object}
 */
export const makeGetFilteredLocations = getFilters => createSelector(
  getLocationsStorage,
  getFilters,
  (storage, filters) => {
    // Get base locations.
    const key = generateSortedHash(filters);
    const codes = storage.locationsByFilter[key] || [];
    const locations = codes.map(code => storage.locationsByCode[code]);

    // Enhance with inventory data.
    const { productCode } = filters;
    if (!productCode) {
      return locations;
    }
    return locations.map((location) => {
      const pair = generateSortedHash({
        productCode,
        locationCode: location.code,
      });
      const inventory = storage.inventoriesByCodePair[pair] || null;
      if (inventory) {
        return {
          ...location,
          inventory,
        };
      }
      return location;
    });
  }
);

/**
 * Creates a selector that retrieves active filter.
 * @param {Object} state State.
 * @returns {Object}
 */
export const getActiveFilter = createSelector(
  getLocationsState,
  (locationsState) => {
    const { geolocation, ...rest } = locationsState.userSearch;
    let longitude;
    let latitude;

    if (geolocation) {
      ({ longitude, latitude } = geolocation);
    }

    return pickBy({
      ...rest,
      longitude,
      latitude,
    });
  }
);

/**
 * Creates a selector that retrieves all locations for a given product.
 * @param {Function} getProductCode Has to retrieve the product code.
 * @returns {Object}
 */
export const makeGetLocationsForProduct = (getProductCode) => {
  /* eslint-disable require-jsdoc */
  const getFilters = (state, props) => ({
    productCode: getProductCode(state, props),
    ...pickBy(getActiveFilter(state)),
  });

  /* eslint-enable require-jsdoc */
  return makeGetFilteredLocations(getFilters);
};

/**
 * Creates a selector that retrieves all locations for the store fonder.
 * @returns {Object}
 */
export const makeGetLocationsForStoreFinder = () => {
  /* eslint-disable require-jsdoc */
  const getFilters = state => ({
    enableInLocationFinder: true,
    ...pickBy(getStoreFinderSearch(state)),
    ...pickBy(getActiveFilter(state)),
  });
  /* eslint-enable require-jsdoc */

  return makeGetFilteredLocations(getFilters);
};

/**
 * Selector that retrieves is fetching.
 * @param {Object} state State.
 * @returns {Object}
 */
export const getIsFetching = state => getLocationsStorage(state).isFetching;

/**
 * Creates a selector that retrieves all locations for a given product.
 * @param {Object} state State.
 * @returns {Object}
 */
export const getFilteredLocations = makeGetFilteredLocations(getActiveFilter);

/**
 * Gets the address of the users preferred location.
 * @param {Object} state State.
 * @return {Object}
 */
export const getPreferredLocationAddress = (state) => {
  const storage = getLocationsStorage(state);
  const locationCode = storage.preferredLocation.code;
  return storage.locationsByCode[locationCode]?.address;
};

/**
  Gets the users preferred location.
 * @param {Object} state State.
 * @param {Object} props Props.
 * @return {Object}
 */
export const getPreferredLocation = (state, props) => {
  const storage = getLocationsStorage(state);
  const locationCode = storage.preferredLocation.code;

  // Figure out default location.
  if (!locationCode && (props?.productId || props?.variantId)) {
    const getAvailable = makeGetLocationsForProduct(
      (_, iprops) => iprops.variantId || iprops.productId
    );
    const available = getAvailable(state, props);

    return available?.[0] || null;
  }

  return storage.locationsByCode[locationCode] || null;
};

/**
  Gets the users preferred fulfillment method.
 * @param {Object} state State.
 * @param {Object} props Props.
 * @return {Object}
 */
export const getPreferredFulfillmentMethod = (state, props) => {
  const storage = getLocationsStorage(state);
  const method = storage.preferredFulfillmentMethod.type;

  // Figure out a default fo method.
  if (!method) {
    try {
      const available = getProductFulfillmentMethods(state, props);
      return available?.[0] || null;
    } catch (err) {
      return null;
    }
  }

  return method;
};

/**
 * Creates a selector that checks if the preferred fulfillment method is selectable for a product
 * @returns {Function}
 */
export const isPreferredFulfillmentMethodSelectableForProduct = createSelector(
  getPreferredFulfillmentMethod,
  getProductFulfillmentMethods,
  (preferredMethod, productMethods) => {
    if (!preferredMethod || !Array.isArray(productMethods)) {
      return false;
    }

    return productMethods.includes(preferredMethod);
  }
);
/**
 * Retrieves the user's search.
 * @param {Object} state State.
 * @returns {Object}
 */
export const getUserSearch = (state) => {
  const locationState = getLocationsState(state);
  return locationState.userSearch;
};

/**
 * Retrieves the country code from the user's search.
 * @param {Object} state State.
 * @returns {string}
 */
export const getUserSearchCountryCode = (state) => {
  const userSearch = getUserSearch(state);
  return userSearch.countryCode || '';
};

/**
 * @param {Object} state State.
 * @returns {string}
 */
export const getUserSearchGeolocation = (state) => {
  const userSearch = getUserSearch(state);
  return userSearch.geolocation;
};

/**
 * Retrieves the postal code from the user's search.
 * @param {Object} state State.
 * @returns {string}
 */
export const getUserSearchPostalCode = (state) => {
  const userSearch = getUserSearch(state);
  return userSearch.postalCode;
};

/**
 * Creates a new selector that retrieves a location by its code.
 * @param {Function} getLocationCode Has to retrieve the location code.
 * @returns {Object}
 */
export const makeGetLocation = getLocationCode => (state, props) => {
  const locationCode = getLocationCode(state, props);
  return getLocationsStorage(state).locationsByCode[locationCode] || null;
};

/**
 * Creates a selector that retrieves the inventory for a product at a location.
 * @param {Function} getLocationCode Has to retrieve the location code.
 * @param {Function} getProductCode Has to retrieve the product code.
 * @returns {Object}
 */
export const makeGetLocationInventory = (getLocationCode, getProductCode) => (state, props) => {
  const locationCode = getLocationCode(state, props);
  const productCode = getProductCode(state, props);

  const storage = getLocationsStorage(state);
  const pair = generateSortedHash({
    productCode,
    locationCode,
  });
  return storage.inventoriesByCodePair[pair] || null;
};

/**
 * Creates a selector that retrieves the fulfillment methods for a product at a location.
 * @param {Function} getLocationCode Has to retrieve the location code.
 * @returns {Object}
 */
export const makeGetLocationFulfillmentMethods = (getLocationCode) => {
  const getLocation = makeGetLocation(getLocationCode);
  return createSelector(
    getLocation,
    location => location?.supportedFulfillmentMethods || []
  );
};

/**
 * Creates a selector that determines if a location supports a specified fulfillment method.
 * @param {Function} getLocationCode Has to retrieve the location code.
 * @param {string} fulfillmentMethod The fulfillment method to check.
 * @returns {Function}
 */
export const makeIsLocationFulfillmentMethodEnabled = (getLocationCode, fulfillmentMethod) => {
  const getLocationFulfillmentMethods = makeGetLocationFulfillmentMethods(getLocationCode);

  return createSelector(
    getLocationFulfillmentMethods,
    state => state,
    (state, props) => props,
    (fulfillmentMethods, state, props) => {
      if (!fulfillmentMethods) {
        return false;
      }

      const method = typeof fulfillmentMethod === 'function' ?
        fulfillmentMethod(state, props) :
        fulfillmentMethod;

      return fulfillmentMethods.includes(method);
    }
  );
};

/**
 * Selector that retrieves the user's reserve form input.
 * @returns {Function}
 */
export const getUserFormInput = createSelector(
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

/**
 * Creates a selector that retrieves the flag that decides if a product is currently orderable.
 * @param {Function} getLocationCode Has to retrieve the location code.
 * @param {Function} getProductCode Has to retrieve the product code.
 * @returns {Function}
 */
export const makeIsRopeProductOrderable = (getLocationCode, getProductCode) => {
  const getInventory = makeGetLocationInventory(getLocationCode, getProductCode);
  const getLocation = makeGetLocation(getLocationCode);

  return createSelector(
    getPreferredFulfillmentMethod,
    getLocation,
    getInventory,
    isPreferredFulfillmentMethodSelectableForProduct,
    (fulfillmentMethod, location, inventory, fulfillmentMethodSelectable) => {
      if (
        fulfillmentMethod === DIRECT_SHIP
      ) {
        return null;
      }

      if (!fulfillmentMethodSelectable) {
        return false;
      }

      if (location === null) {
        return false;
      }

      return isProductAvailable(location, inventory);
    }
  );
};

/**
 * Creates a selector that checks if the Fulfillment Selector should be disabled.
 * @param {Function} getLocationCode Has to retrieve the location code.
 * @param {Function} getProductCode Has to retrieve the product code.
 * @param {string} fulfillmentMethod The fulfillment method to check.
 * @param {bool} ignoreLocationMethods[false] Wether the location fulfillment methods are ignored
 * @returns {Function}
 */
export const makeIsFulfillmentSelectorMethodEnabled = (
  getLocationCode,
  getProductCode,
  fulfillmentMethod,
  ignoreLocationMethods = false
) => {
  const getLocation = makeGetLocation(getLocationCode);
  const getInventory = makeGetLocationInventory(getLocationCode, getProductCode);
  const getMerchantFulfillmentMethods = makeGetEnabledFulfillmentMethods();
  const isProductActive = makeIsProductActive();
  const isBaseProductActive = makeIsBaseProductActive();
  const useLocationFulfillmentMethods = makeUseLocationFulfillmentMethods();

  const getLocationFulfillmentMethods = makeGetLocationFulfillmentMethods(getLocationCode);
  return createSelector(
    isProductActive,
    isBaseProductActive,
    getLocation,
    getInventory,
    getMerchantFulfillmentMethods,
    getProductFulfillmentMethods,
    getLocationFulfillmentMethods,
    getIsLocationBasedShopping,
    useLocationFulfillmentMethods,
    (
      productActive,
      baseProductActive,
      location,
      inventory,
      merchantMethods,
      productMethods,
      locationMethods,
      isLocationBasedShopping,
      locationFulfillmentMethodsUsed
    ) => {
      if (!productActive || !baseProductActive) {
        return false;
      }

      if (isLocationBasedShopping && (!location || !inventory)) {
        return false;
      }

      let methodSupported =
        Array.isArray(merchantMethods) &&
        merchantMethods.includes(fulfillmentMethod) &&
        Array.isArray(productMethods) &&
        productMethods.includes(fulfillmentMethod);

      if (fulfillmentMethod === DIRECT_SHIP && methodSupported) {
        return true;
      }

      if (locationFulfillmentMethodsUsed && !ignoreLocationMethods && location) {
        methodSupported = methodSupported &&
          Array.isArray(locationMethods) &&
          locationMethods.includes(fulfillmentMethod);
      }

      if (!methodSupported) {
        return false;
      }

      return true;
    }
  );
};

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

/**
 * Returns the pending state.
 * @param {Object} state State
 * @returns {boolean}
 */
export const getIsPending = state => getLocationsStorage(state).pending;

/**
 * Checks if the cart state is currently configurable
 * During checkout the state is read only to make sure
 * the user can't switch locations and timeslots.
 */
export const getIsCartStateConfigurable = createSelector(
  getCurrentRoute,
  route => route?.pathname?.indexOf('checkout') === -1
);

/**
 * Get fulfillment slots for a location.
 * @param {string} getLocationCode Location code selector.
 * @returns {Array}
 */
export const makeGetFulfillmentSlotsForLocation = getLocationCode => createSelector(
  getLocationsStorage,
  getLocationCode,
  (storage, locationCode) => storage.fulfillmentSlotsByLocation?.[locationCode]
);

/**
 * Get alternative location params by geo location, preferred location, etc.
 * @type {Object}
 */
export const getProductAlternativeLocationParams = createSelector(
  getUserSearch,
  getPreferredLocation,
  (userSearch, preferredLocation) => {
    if (!userSearch) {
      return null;
    }
    const params = {
      countryCode: userSearch.countryCode,
    };
    if (userSearch.geoLocation) {
      params.geolocation = userSearch.geoLocation;
    } else if (userSearch.postalCode) {
      params.postalCode = userSearch.postalCode;
    } else if (preferredLocation) {
      params.geolocation = {
        latitude: preferredLocation.latitude,
        longitude: preferredLocation.longitude,
      };
    }

    return params;
  }
);

/**
 * @param {Function} getParams get params for fetch locations.
 * @returns {Array}
 */
export const getProductAlternativeLocations = createSelector(
  (_, props) => props.productId,
  (_, props) => props.params,
  getLocationsStorage,
  getProductAlternativeLocationParams,
  (productId, propsParams, storage, alternativeParams) => {
    if (!alternativeParams) {
      return null;
    }
    const fetchParams = {
      productCode: productId,
      ...alternativeParams,
      ...propsParams,
    };

    if (fetchParams.geolocation) {
      fetchParams.latitude = fetchParams.geolocation.latitude;
      fetchParams.longitude = fetchParams.geolocation.longitude;
      delete fetchParams.geolocation;
    }
    const sortedHash = generateSortedHash(fetchParams);

    const codes = storage.locationsByFilter[sortedHash] || [];
    const locations = codes
      .map(code => storage.locationsByCode[code])
      .map((location) => {
        const pair = generateSortedHash({
          productCode: productId,
          locationCode: location.code,
        });

        return {
          ...location,
          productInventory: storage.inventoriesByCodePair[pair] || null,
        };
      });

    return locations.length ? locations : null;
  }
);
