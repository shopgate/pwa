import { produce } from 'immer';
import {
  REQUEST_LOCATIONS,
  RECEIVE_LOCATIONS,
  ERROR_LOCATIONS,
} from '../constants';

export const CACHE_TIME = 10 * 60 * 1000; // 10 minutes in milliseconds

/**
 * Stores the product locations by the location code.
 * @param {Object} [state={}] The current state.
 * @param {Object} action The action object.
 * @returns {Object} The new state.
 */
export default function locationsById(state = {}, action) {
  /* eslint-disable no-param-reassign */
  const producer = produce((draft) => {
    switch (action.type) {
      case REQUEST_LOCATIONS: {
        action.params.codes.forEach((code) => {
          draft[code] = {
            ...draft[code],
            isFetching: true,
            expires: 0,
          };
        });

        break;
      }

      case ERROR_LOCATIONS: {
        action.params.codes.forEach((code) => {
          draft[code] = {
            isFetching: false,
            expires: 0,
          };
        });

        break;
      }

      case RECEIVE_LOCATIONS: {
        action.locations.forEach((location) => {
          draft[location.code] = {
            isFetching: false,
            expires: Date.now() + CACHE_TIME,
            location: {
              ...location,
              address: location.addresses.find(a => a.isPrimary) || location.addresses[0],
            },
          };
        });

        break;
      }

      default:
        break;
    }
  });

  /* eslint-enable no-param-reassign */
  return producer(state);
}
