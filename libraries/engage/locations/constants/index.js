// ACTION TYPES
export {
  SELECT_LOCATION,
  STORE_FORM_INPUT,
  REQUEST_LOCATIONS,
  RECEIVE_LOCATIONS,
  ERROR_LOCATIONS,
  REQUEST_PRODUCT_LOCATIONS,
  RECEIVE_PRODUCT_LOCATIONS,
  ERROR_PRODUCT_LOCATIONS,
  SUBMIT_RESERVATION_REQUEST,
  SUBMIT_RESERVATION_SUCCESS,
  SUBMIT_RESERVATION_ERROR,
} from './ActionTypes';

// PIPELINES
export {
  SHOPGATE_STOREFRONT_GET_PRODUCT_LOCATIONS,
  SHOPGATE_STOREFRONT_CREATE_ORDER,
  SHOPGATE_STOREFRONT_GET_LOCATIONS,
  SHOPGATE_STOREFRONT_GET_CART,
} from './Pipelines';

// PORTALS
export {
  PRODUCT_FULFILLMENT_SELECTOR_BEFORE,
  PRODUCT_FULFILLMENT_SELECTOR,
  PRODUCT_FULFILLMENT_SELECTOR_AFTER,
  PRODUCT_LOCATION_STOCK_INFO_BEFORE,
  PRODUCT_LOCATION_STOCK_INFO,
  PRODUCT_LOCATION_STOCK_INFO_AFTER,
} from './Portals';

export const PRODUCT_FULFILLMENT_METHOD_DIRECT_SHIP = 'directShip';
export const PRODUCT_FULFILLMENT_METHOD_IN_STORE_PICKUP = 'inStorePickup';

export const FULFILLMENT_PATH_QUICK_RESERVE = 'quickReserve';
export const FULFILLMENT_PATH_MULTI_LINE_RESERVE = 'multiLineReserve';
