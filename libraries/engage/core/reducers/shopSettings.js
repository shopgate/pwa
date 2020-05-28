import { produce } from 'immer';
import {
  RECEIVE_SHOP_SETTINGS,
  ERROR_SHOP_SETTINGS,
  SHOP_SETTING_CART_SUPPLEMENTAL_CONTENT,
  SHOP_SETTING_ORDER_SUPPLEMENTAL_CONTENT,
  SHOP_SETTING_SHOW_SHOP_LOGO_IN_WEB,
  SHOP_SETTING_SHOW_SHOP_LOGO_IN_APP,
} from '../constants';

const defaultState = {
  [SHOP_SETTING_CART_SUPPLEMENTAL_CONTENT]: null,
  [SHOP_SETTING_ORDER_SUPPLEMENTAL_CONTENT]: null,
  [SHOP_SETTING_SHOW_SHOP_LOGO_IN_WEB]: true,
  [SHOP_SETTING_SHOW_SHOP_LOGO_IN_APP]: true,
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
      case RECEIVE_SHOP_SETTINGS: {
        Object.keys(action.settings).forEach((key) => {
          draft[key] = action.settings[key];
        });

        break;
      }
      case ERROR_SHOP_SETTINGS: {
        draft = {
          ...defaultState,
          ...state,
        };

        break;
      }
      default:
        break;
    }
  });

  /* eslint-enable no-param-reassign */
  return producer(state);
}
