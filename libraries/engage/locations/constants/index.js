// ACTION TYPES
export {
  REQUEST_LOCATIONS,
  RECEIVE_LOCATIONS,
  ERROR_LOCATIONS,
  REQUEST_PRODUCT_INVENTORIES,
  RECEIVE_PRODUCT_INVENTORIES,
  ERROR_PRODUCT_INVENTORIES,
  REQUEST_INVENTORIES,
  RECEIVE_INVENTORIES,
  ERROR_INVENTORIES,
  SELECT_LOCATION,
  SELECT_GLOBAL_LOCATION,
  STORE_FORM_INPUT,
  STORE_FULFILLMENT_METHOD,
  SET_USER_SEARCH_COUNTRY_CODE,
  SET_USER_SEARCH_POSTAL_CODE,
  SET_USER_SEARCH_GEOLOCATION,
  SET_USER_GEOLOCATION,
  SET_STORE_FINDER_SEARCH_RADIUS,
  REQUEST_PRODUCT_LOCATIONS,
  RECEIVE_PRODUCT_LOCATIONS,
  ERROR_PRODUCT_LOCATIONS,
  SUBMIT_RESERVATION_REQUEST,
  SUBMIT_RESERVATION_SUCCESS,
  SUBMIT_RESERVATION_ERROR,
  FETCH_FULFILLMENT_SLOTS_ERROR,
  FETCH_FULFILLMENT_SLOTS_SUCCESS,
  PROVIDE_PRODUCT_ALTERNATIVE_LOCATION,
} from './ActionTypes';

// PIPELINES
export {
  SHOPGATE_STOREFRONT_GET_PRODUCT_LOCATIONS,
  SHOPGATE_STOREFRONT_CREATE_ORDER,
  SHOPGATE_STOREFRONT_GET_LOCATIONS,
  SHOPGATE_STOREFRONT_GET_PRODUCT_INVENTORIES,
  SHOPGATE_STOREFRONT_GET_INVENTORIES,
} from './Pipelines';

// PORTALS
export {
  PRODUCT_FULFILLMENT_SELECTOR,
  PRODUCT_LOCATION_STOCK_INFO,
} from './Portals';

export const DIRECT_SHIP = 'directShip';
export const DIRECT_SHIP_LABEL = 'locations.fulfillment.direct_ship';
export const IN_STORE_PICKUP_BOPIS = 'inStorePickupBOPIS';
export const IN_STORE_PICKUP_BOPIS_LABEL = 'locations.fulfillment.bopis';
export const IN_STORE_PICKUP_ROPIS = 'inStorePickupROPIS';
export const IN_STORE_PICKUP_ROPIS_LABEL = 'locations.fulfillment.ropis';
export const ROPIS = 'ROPIS';
export const BOPIS = 'BOPIS';
export const QUICK_RESERVE = 'quickReserve';
export const MULTI_LINE_RESERVE = 'multiLineReserve';

export const SORT_CLOSEST_LOCATION = 'closestLocation';
export const SORT_CLOSEST_LOCATION_WITH_INVENTORY = 'closestLocationWithInventory';

export const DEFAULT_ROPE_FULFILLMENT_METHOD = 'defaultRopeFulfillmentMethod';

export const USER_SEARCH_GEOLOCATION_LIFETIME = 3e5; // 5 minutes for geolocation expire
export const NEARBY_LOCATIONS_LIMIT = 8;
// 25 miles in km
export const NEARBY_LOCATIONS_RADIUS = 25 * 1.60934;
// 10 miles in km
export const MAP_RADIUS_KM = 10 * 1.60934;

export {
  STAGE_SELECT_STORE,
  STAGE_RESERVE_FORM,
  STAGE_RESPONSE_SUCCESS,
  STAGE_RESPONSE_ERROR,
  STAGE_FULFILLMENT_METHOD,
} from './Stages';

export {
  STORE_FINDER_PATTERN,
  STORE_DETAILS_PATTERN,
  STORE_DETAILS_PATH,
} from './routes';
