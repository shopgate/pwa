import { createSelector } from 'reselect';
import {
  WISHLIST_MODE_PERSIST_ON_ADD,
  SHOP_SETTING_WISHLIST_MODE,
  SHOP_SETTING_IMAGES,
  SHOP_SETTING_IMAGES_PRODUCT_PLACEHOLDER,
  SHOP_SETTING_IMAGES_CATEGORY_PLACEHOLDER,
  SHOP_SETTING_IMAGES_FAVICON,
  SHOP_SETTING_NUMBER_OF_ADDRESS_LINES,
  SHOP_SETTING_GOOGLE_SITE_VERIFICATION_CODE,
  SHOP_SETTINGS_SHOW_CATEGORY_IMAGES,
  SHOP_SETTING_REGISTRATION_MODE,
  SHOP_SETTING_REGISTRATION_MODE_EXTENDED,
  SHOP_SETTING_LOAD_WISHLIST_ON_APP_START_ENABLED,
  SHOP_SETTING_WISHLIST_ITEM_QUANTITY_ENABLED,
  SHOP_SETTING_WISHLIST_ITEM_NOTES_ENABLED,
  SHOP_SETTING_SHOW_WISHLIST_ITEMS_COUNT_BADGE,
} from '../constants/shopSettings';

/**
 * Retrieves the shopSettings state from the store.
 * @param {Object} state The current application state.
 * @return {Object} The locations state.
 */
export const getState = state => state?.settings?.shopSettings || {};

/**
 * Creates a selector to retrieve a single shop setting.
 * @param {string} key The key of the shop setting
 * @param {*} [fallback=null] The fallback value when no value can be determined.
 * @returns {Function}
 */
export const makeGetShopSettingByKey = (key, fallback = null) => createSelector(
  getState,
  state => (typeof state?.[key] !== 'undefined' ? state?.[key] : fallback)
);

/**
 * Creates a selector to retrieve multiple shop setting.
 * @param {Array} [keys=[]] Optional keys to filter.
 * @returns {Function}
 */
export const makeGetShopSettings = (keys = []) => createSelector(
  getState,
  (state) => {
    const result = Object.keys(state).filter((key) => {
      if (Array.isArray(keys) && keys.length > 0) {
        return keys.includes(key);
      }

      return true;
    }).reduce((acc, key) => {
      if (state?.[key]) {
        acc[key] = state[key];
      }

      return acc;
    }, {});

    return result;
  }
);

/** Selects the current wishlist mode */
export const getWishlistMode = makeGetShopSettingByKey(
  SHOP_SETTING_WISHLIST_MODE,
  WISHLIST_MODE_PERSIST_ON_ADD
);

const getShopSettingImages = makeGetShopSettingByKey(SHOP_SETTING_IMAGES, {});

/**
 * Selects the placeholder image for products
 */
export const getProductImagePlaceholder = createSelector(
  getShopSettingImages,
  images => images?.[SHOP_SETTING_IMAGES_PRODUCT_PLACEHOLDER] || null
);

/**
 * Selects the placeholder image for products
 */
export const getCategoryImagePlaceholder = createSelector(
  getShopSettingImages,
  images => images?.[SHOP_SETTING_IMAGES_CATEGORY_PLACEHOLDER] || null
);
/**
 * Selects the placeholder image for products
 */
export const getFavicon = createSelector(
  getShopSettingImages,
  images => images?.[SHOP_SETTING_IMAGES_FAVICON] || null
);

/**
 * Selects the number of address lines for registration / address forms
 */
export const getNumberOfAddressLines = makeGetShopSettingByKey(
  SHOP_SETTING_NUMBER_OF_ADDRESS_LINES,
  2
);

export const getGoogleSiteVerificationCode = makeGetShopSettingByKey(
  SHOP_SETTING_GOOGLE_SITE_VERIFICATION_CODE,
  ''
);

export const getShowCategoryImages = makeGetShopSettingByKey(
  SHOP_SETTINGS_SHOW_CATEGORY_IMAGES,
  true
);

/**
 * Creates a selector to retrieve the current active registration mode.
 * When the selector returns "simple" the form will not contain any address related fields.
 */
export const getRegistrationMode = makeGetShopSettingByKey(
  SHOP_SETTING_REGISTRATION_MODE,
  SHOP_SETTING_REGISTRATION_MODE_EXTENDED
);

export const getWishlistItemQuantityEnabled = makeGetShopSettingByKey(
  SHOP_SETTING_WISHLIST_ITEM_QUANTITY_ENABLED,
  false
);

export const getWishlistItemNotesEnabled = makeGetShopSettingByKey(
  SHOP_SETTING_WISHLIST_ITEM_NOTES_ENABLED,
  false
);

export const getLoadWishlistOnAppStartEnabled = makeGetShopSettingByKey(
  SHOP_SETTING_LOAD_WISHLIST_ON_APP_START_ENABLED,
  true
);

export const getShowWishlistItemsCountBadge = createSelector(
  getLoadWishlistOnAppStartEnabled,
  makeGetShopSettingByKey(
    SHOP_SETTING_SHOW_WISHLIST_ITEMS_COUNT_BADGE,
    true
  ),
  (loadWishlistOnAppStartEnabled, showWishlistItemsCountBadge) =>
    (loadWishlistOnAppStartEnabled ? showWishlistItemsCountBadge : false)
);
