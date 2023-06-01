import { produce } from 'immer';
import { SORT_RELEVANCE } from '@shopgate/pwa-common/constants/DisplayOptions';
import {
  RECEIVE_SHOP_SETTINGS,
  ERROR_SHOP_SETTINGS,
  SHOP_SETTING_GOOGLE_SITE_VERIFICATION_CODE,
  SHOP_SETTING_CART_SUPPLEMENTAL_CONTENT,
  SHOP_SETTING_ORDER_SUPPLEMENTAL_CONTENT,
  SHOP_SETTING_SHOW_SHOP_LOGO_IN_WEB,
  SHOP_SETTING_SHOW_SHOP_LOGO_IN_APP,
  SHOP_SETTING_PRODUCTS_SORT_ORDER,
  SHOP_SETTING_IMAGES,
  SHOP_SETTING_IMAGES_PRODUCT_PLACEHOLDER,
  SHOP_SETTING_IMAGES_CATEGORY_PLACEHOLDER,
  SHOP_SETTING_IMAGES_FAVICON,
  SHOP_SETTING_NUMBER_OF_ADDRESS_LINES,
  SHOP_SETTING_WISHLIST_ITEM_QUANTITY_ENABLED,
  SHOP_SETTING_WISHLIST_ITEM_NOTES_ENABLED,
  SHOP_SETTING_LOAD_WISHLIST_ON_APP_START_ENABLED,
  SHOP_SETTING_SHOW_WISHLIST_ITEMS_COUNT_BADGE,
} from '../constants';

const defaultState = {
  [SHOP_SETTING_GOOGLE_SITE_VERIFICATION_CODE]: null,
  [SHOP_SETTING_CART_SUPPLEMENTAL_CONTENT]: null,
  [SHOP_SETTING_ORDER_SUPPLEMENTAL_CONTENT]: null,
  [SHOP_SETTING_SHOW_SHOP_LOGO_IN_WEB]: true,
  [SHOP_SETTING_SHOW_SHOP_LOGO_IN_APP]: true,
  [SHOP_SETTING_PRODUCTS_SORT_ORDER]: SORT_RELEVANCE,
  [SHOP_SETTING_NUMBER_OF_ADDRESS_LINES]: 2,
  [SHOP_SETTING_IMAGES]: {
    [SHOP_SETTING_IMAGES_PRODUCT_PLACEHOLDER]: null,
    [SHOP_SETTING_IMAGES_CATEGORY_PLACEHOLDER]: null,
    [SHOP_SETTING_IMAGES_FAVICON]: null,
  },
  [SHOP_SETTING_WISHLIST_ITEM_QUANTITY_ENABLED]: false,
  [SHOP_SETTING_WISHLIST_ITEM_NOTES_ENABLED]: false,
  [SHOP_SETTING_LOAD_WISHLIST_ON_APP_START_ENABLED]: true,
  [SHOP_SETTING_SHOW_WISHLIST_ITEMS_COUNT_BADGE]: true,
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
