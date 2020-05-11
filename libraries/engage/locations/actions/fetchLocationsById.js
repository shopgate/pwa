import { shouldFetchData } from '@shopgate/pwa-common/helpers/redux';
import { makeGetLocationsState } from '../selectors';
import fetchLocations from './fetchLocations';

// To persist the cache, the store needs to be registered within the reducers.js of the themes.
const USE_CACHE = false;

/**
 * @param {string[]} locationIds The location codes.
 * @returns {Function} A redux thunk.
 */
function fetchLocationsById(locationIds) {
  return async (dispatch, getState) => {
    const getLocationsState = makeGetLocationsState();
    const locationsState = getLocationsState(getState());

    let toBeFetchedLocationIds = locationIds.filter((locationId) => {
      const location = locationsState[locationId];

      if (USE_CACHE) {
        return shouldFetchData(location);
      }

      // Fetch when not yet fetched, or in the previous data structure
      return !location || typeof location.isFetching === 'undefined';
    });

    toBeFetchedLocationIds = Array.from(new Set(toBeFetchedLocationIds));

    if (toBeFetchedLocationIds.length > 0) {
      await dispatch(fetchLocations({ codes: toBeFetchedLocationIds }));
    }
  };
}

export default fetchLocationsById;
