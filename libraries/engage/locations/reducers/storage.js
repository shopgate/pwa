import { produce } from 'immer';
import { generateSortedHash } from '@shopgate/pwa-common/helpers/redux/generateSortedHash';
import {
  ERROR_LOCATIONS,
  REQUEST_LOCATIONS,
  RECEIVE_LOCATIONS,
  REQUEST_PRODUCT_LOCATIONS,
  RECEIVE_PRODUCT_LOCATIONS,
  ERROR_PRODUCT_LOCATIONS,
  STORE_FULFILLMENT_METHOD,
  SELECT_LOCATION,
  FETCH_FULFILLMENT_SLOTS_SUCCESS, RECEIVE_PRODUCT_INVENTORIES,
} from '../constants';

const initialState = {
  // If general usage of state has been finished.
  // Currently used to identify if any change is currently pending
  // before the store switcher is being displayed.
  pending: true,
  // If any data is being fetched right now.
  isFetching: false,
  // The users preferred fulfillment location.
  preferredLocation: {
    code: null,
  },
  // The users preferred fulfillment method.
  preferredFulfillmentMethod: {
    type: null,
  },
  // All location information stored by code.
  locationsByCode: {},
  // Inventory for a specific location and product.
  inventoriesByCodePair: {},
  // List of locations that based on a given filter.
  locationsByFilter: {},
  // Available FO slots mapped by location.
  fulfillmentSlotsByLocation: {},
};

/* eslint-disable no-param-reassign */

/**
 * Stores a list of locations and updates the store.
 * @param {Object} draft Draft
 * @param {Array} locations Locations
 */
const storeLocationData = (draft, locations) => {
  locations.forEach((location) => {
    // Remove some situational data to avoid confusion.
    // The location storage should only contain the raw location info.
    const { productInventory, ...filteredData } = location;
    draft.locationsByCode[location.code] = filteredData;

    // Enhance with primary address for easier lookup.
    draft.locationsByCode[location.code].address = location.addresses
      .find(a => a.isPrimary) || location.addresses[0];
  });
};

export default (state = initialState, action) => {
  const producer = produce((draft) => {
    switch (action.type) {
      case REQUEST_LOCATIONS:
      case REQUEST_PRODUCT_LOCATIONS:
        draft.isFetching = true;
        break;

      case ERROR_LOCATIONS:
      case ERROR_PRODUCT_LOCATIONS:
        draft.isFetching = false;
        break;

      case FETCH_FULFILLMENT_SLOTS_SUCCESS: {
        draft.fulfillmentSlotsByLocation = draft.fulfillmentSlotsByLocation || {};
        draft.fulfillmentSlotsByLocation[action.locationCode] = action.fulfillmentSlots;
        break;
      }

      case RECEIVE_LOCATIONS: {
        // Store all missing locations.
        storeLocationData(draft, action.locations);

        // Store filtered result set.
        const locationCodes = action.locations.map(l => l.code);
        const filter = generateSortedHash({ ...action.filters });
        draft.locationsByFilter[filter] = locationCodes;
        draft.initialized = true;
        draft.isFetching = false;
        draft.pending = false;
        break;
      }
      case RECEIVE_PRODUCT_INVENTORIES: {
        action.inventories.forEach((inventory) => {
          const { locationCode, ...rest } = inventory;
          const key = generateSortedHash({
            productCode: action.productCode,
            locationCode,
          });

          draft.inventoriesByCodePair[key] = rest;
        });

        break;
      }
      case RECEIVE_PRODUCT_LOCATIONS: {
        // Store all missing locations.
        storeLocationData(draft, action.locations);

        // For each location we store a new inventory entry.
        action.locations.forEach((location) => {
          const key = generateSortedHash({
            productCode: action.productCode,
            locationCode: location.code,
          });
          // Keep bin/binLocation for location if present
          draft.inventoriesByCodePair[key] = {
            ...draft.inventoriesByCodePair[key],
            ...location.productInventory,
          };
        });

        // Store filtered result set.
        const filter = generateSortedHash({
          productCode: action.productCode,
          ...action.filters,
        });
        const locationCodes = action.locations.map(l => l.code);
        draft.locationsByFilter[filter] = locationCodes;
        draft.pending = false;
        draft.isFetching = false;
        break;
      }

      case STORE_FULFILLMENT_METHOD:
        draft.preferredFulfillmentMethod.type = action.method;
        break;

      case SELECT_LOCATION:
        draft.preferredLocation.code = action.location?.code || null;
        break;

      default:
        break;
    }
  });
  return producer(state);
};

/* eslint-enable no-param-reassign */
