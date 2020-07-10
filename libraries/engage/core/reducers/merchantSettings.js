import { produce } from 'immer';
import {
  RECEIVE_MERCHANT_SETTINGS,
  MERCHANT_SETTINGS_LOCATION_BASED_SHOPPING_ENABLED,
} from '../constants';

const defaultState = {
  [MERCHANT_SETTINGS_LOCATION_BASED_SHOPPING_ENABLED]: false,
};

/**
 * Stores the product locations by the location code.
 * @param {Object} [state={}] The current state.
 * @param {Object} action The action object.
 * @returns {Object} The new state.
 */
export default function shopSettings(state = defaultState, action) {
  /* eslint-disable no-param-reassign */
  const producer = produce((draft) => {
    switch (action.type) {
      case RECEIVE_MERCHANT_SETTINGS: {
        Object.keys(action.settings).forEach((key) => {
          draft[key] = action.settings[key];
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
