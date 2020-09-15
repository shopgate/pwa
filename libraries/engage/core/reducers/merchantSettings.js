import { produce } from 'immer';
import appConfig from '@shopgate/pwa-common/helpers/config';
import {
  RECEIVE_MERCHANT_SETTINGS,
  MERCHANT_SETTINGS_LOCATION_BASED_SHOPPING_ENABLED,
  MERCHANT_SETTINGS_SUBSTITUTION_PREFERENCES_ENABLED,
  MERCHANT_SETTINGS_RESTRICT_MULTI_LOCATION_ORDERS,
  MERCHANT_SETTINGS_DEFAULT_CURRENCY,
} from '../constants';

const { locales: { currency = null } = {} } = appConfig;

const defaultState = {
  [MERCHANT_SETTINGS_LOCATION_BASED_SHOPPING_ENABLED]: false,
  [MERCHANT_SETTINGS_SUBSTITUTION_PREFERENCES_ENABLED]: false,
  [MERCHANT_SETTINGS_RESTRICT_MULTI_LOCATION_ORDERS]: false,
  [MERCHANT_SETTINGS_DEFAULT_CURRENCY]: currency,
};

/**
 * Stores the merchant settings.
 * @param {Object} [state={}] The current state.
 * @param {Object} action The action object.
 * @returns {Object} The new state.
 */
export default function merchantSettings(state = defaultState, action) {
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
