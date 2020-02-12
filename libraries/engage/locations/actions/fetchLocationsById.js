import { makeGetLocationsState } from '../selectors';
import fetchLocations from './fetchLocations';

/**
 * @param {string[]} locationIds The location codes.
 * @returns {Function} A redux thunk.
 */
function fetchLocationsById(locationIds) {
  return async (dispatch, getState) => {
    const getLocationsState = makeGetLocationsState();
    const locationsState = getLocationsState(getState());

    const hitLocations = locationIds.filter(locationId => locationsState[locationId])
      .map(locationId => locationsState[locationId]);

    const missLocationIds = locationIds.filter(locationId => !locationsState[locationId]);

    let locations = [];
    if (missLocationIds.length) {
      ({ locations } = await dispatch(fetchLocations({ codes: missLocationIds })));
    }

    return Promise.resolve(hitLocations.concat(locations));
  };
}

export default fetchLocationsById;
