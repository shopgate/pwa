import { produce } from 'immer';
import {
  REQUEST_SHOP_SETTINGS,
  RECEIVE_SHOP_SETTINGS,
  ERROR_SHOP_SETTINGS,
  CACHE_LEASE_SHOP_SETTINGS,
} from '../constants';

/**
 * Stores the product locations by the location code.
 * @param {Object} [state={}] The current state.
 * @param {Object} action The action object.
 * @returns {Object} The new state.
 */
export default function shopSettings(state = {}, action) {
  /* eslint-disable no-param-reassign */
  const producer = produce((draft) => {
    switch (action.type) {
      case REQUEST_SHOP_SETTINGS: {
        action.keys.forEach((key) => {
          draft[key] = {
            ...draft[key],
            isFetching: true,
            expires: 0,
          };
        });
        break;
      }
      case RECEIVE_SHOP_SETTINGS: {
        Object.keys(action.settings).forEach((key) => {
          draft[key] = {
            isFetching: false,
            expires: Date.now() + CACHE_LEASE_SHOP_SETTINGS,
            data: action.settings[key],
          };
        });

        break;
      }
      case ERROR_SHOP_SETTINGS: {
        action.keys.forEach((key) => {
          draft[key] = {
            isFetching: false,
            expires: 0,
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
