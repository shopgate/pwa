import { createSelector } from 'reselect';
import {
  MERCHANT_SETTINGS_LOCATION_BASED_SHOPPING_ENABLED,
  MERCHANT_SETTINGS_SUBSTITUTION_PREFERENCES_ENABLED,
  MERCHANT_SETTINGS_CUSTOMER_ATTRIBUTES,
  MERCHANT_SETTINGS_FULFILLMENT_SCHEDULED_ENABLED,
  MERCHANT_SETTINGS_RESTRICT_MULTI_LOCATION_ORDERS,
  MERCHANT_SETTINGS_DEFAULT_CURRENCY,
  MERCHANT_SETTINGS_ENABLE_WEB_INDEXING,
  MERCHANT_SETTINGS_PRODUCT_SHOW_ALTERNATIVE_LOCATION,
  MERCHANT_SETTINGS_PRODUCTLIST_SHOW_INVENTORY,
  MERCHANT_SETTINGS_LOAD_WISHLIST_ON_APP_START_ENABLED,
  MERCHANT_SETTINGS_WISHLIST_ITEM_QUANTITY_ENABLED,
  MERCHANT_SETTINGS_WISHLIST_ITEM_NOTES_ENABLED,
  MERCHANT_SETTINGS_SHOW_WISHLIST_ITEMS_COUNT_BADGE,
} from '../constants';

/**
 * Retrieves the merchantSettings state from the store.
 * @param {Object} state The current application state.
 * @return {Object} The locations state.
 */
const getState = state => state?.settings?.merchantSettings || {};

/**
 * Creates a selector to retrieve a single merchant setting.
 * @param {string} key The key of the merchant setting
 * @param {*} [fallback=null] The fallback value when no value can be determined.
 * @returns {Function}
 */
const makeGetMerchantSettingByKey = (key, fallback = null) => createSelector(
  getState,
  state => (typeof state?.[key] !== 'undefined' ? state?.[key] : fallback)
);

export const getIsLocationBasedShopping = makeGetMerchantSettingByKey(
  MERCHANT_SETTINGS_LOCATION_BASED_SHOPPING_ENABLED,
  false
);

export const getSubstitutionPreferencesEnabled = makeGetMerchantSettingByKey(
  MERCHANT_SETTINGS_SUBSTITUTION_PREFERENCES_ENABLED,
  false
);

export const getMerchantCustomerAttributes = makeGetMerchantSettingByKey(
  MERCHANT_SETTINGS_CUSTOMER_ATTRIBUTES,
  []
);

export const getFulfillmentSchedulingEnabled = makeGetMerchantSettingByKey(
  MERCHANT_SETTINGS_FULFILLMENT_SCHEDULED_ENABLED,
  false
);

export const getRestrictMultiLocationOrders = makeGetMerchantSettingByKey(
  MERCHANT_SETTINGS_RESTRICT_MULTI_LOCATION_ORDERS,
  false
);

export const getDefaultCurrency = makeGetMerchantSettingByKey(
  MERCHANT_SETTINGS_DEFAULT_CURRENCY
);

export const getEnableWebIndexing = makeGetMerchantSettingByKey(
  MERCHANT_SETTINGS_ENABLE_WEB_INDEXING,
  false
);

export const getProductShowAlternativeLocation = makeGetMerchantSettingByKey(
  MERCHANT_SETTINGS_PRODUCT_SHOW_ALTERNATIVE_LOCATION,
  false
);

export const getProductListShowInventory = makeGetMerchantSettingByKey(
  MERCHANT_SETTINGS_PRODUCTLIST_SHOW_INVENTORY,
  false
);

export const getWishlistItemQuantityEnabled = makeGetMerchantSettingByKey(
  MERCHANT_SETTINGS_WISHLIST_ITEM_QUANTITY_ENABLED,
  false
);

export const getWishlistItemNotesEnabled = makeGetMerchantSettingByKey(
  MERCHANT_SETTINGS_WISHLIST_ITEM_NOTES_ENABLED,
  false
);

export const getLoadWishlistOnAppStartEnabled = makeGetMerchantSettingByKey(
  MERCHANT_SETTINGS_LOAD_WISHLIST_ON_APP_START_ENABLED,
  true
);

export const getShowWishlistItemsCountBadge = createSelector(
  getLoadWishlistOnAppStartEnabled,
  makeGetMerchantSettingByKey(
    MERCHANT_SETTINGS_SHOW_WISHLIST_ITEMS_COUNT_BADGE,
    true
  ),
  (loadWishlistOnAppStartEnabled, showWishlistItemsCountBadge) =>
    (!loadWishlistOnAppStartEnabled ? false : showWishlistItemsCountBadge)
);

