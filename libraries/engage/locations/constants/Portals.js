// @flow
import { PRODUCT } from '@shopgate/pwa-common-commerce/product/constants/Portals';
import { PRODUCT_ITEM } from '@shopgate/pwa-common-commerce/category/constants/Portals';

// CONTENTS
const FULFILLMENT_SELECTOR = 'fulfillment-selector';
const LOCATION_STOCK_INFO = 'location-stock-info';

const SEARCH = 'search';
const STORE_LIST = 'store_list';
const LOCATION = 'location';

/* PRODUCT DETAILS */
export const PRODUCT_FULFILLMENT_SELECTOR = `${PRODUCT}.${FULFILLMENT_SELECTOR}`;
export const PRODUCT_FULFILLMENT_SELECTOR_LOCATION = `${PRODUCT}.${FULFILLMENT_SELECTOR}.${LOCATION}`;
export const PRODUCT_LOCATION_STOCK_INFO = `${PRODUCT}.${LOCATION_STOCK_INFO}`;

/* PRODUCT LISTS */
export const PRODUCT_LOCATION_STOCK_INFO_LIST = `${PRODUCT_ITEM}.${LOCATION_STOCK_INFO}`;

/* FULFILLMENT SHEET */
export const FULFILLMENT_SHEET = 'fulfillment-sheet';
export const FULFILLMENT_SHEET_PRODUCT = `${FULFILLMENT_SHEET}.${PRODUCT}`;
export const FULFILLMENT_SHEET_SEARCH = `${FULFILLMENT_SHEET}.${SEARCH}`;
export const FULFILLMENT_SHEET_STORE_LIST = `${FULFILLMENT_SHEET}.${STORE_LIST}`;
