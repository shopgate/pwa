// @flow

// ACTIONS
export { fetchProductLocations } from './actions';

// COMPONENTS
export {
  FulfillmentSelector,
  FulfillmentSheet,
  FulfillmentPathSelector,
  StoreList,
  StoreAddress,
  StoreOpeningHours,
  StorePhoneNumber,
  CartItemProductChangeLocation,
  CartChangeFulfillmentMethod,
  CartContextMenuItemChangeLocation,
  CartContextMenuItemChangeFulfillment,
  CartContextMenuChangeFulfillment,
  GlobalLocationSelector,
  GlobalLocationSwitcher,
  FulfillmentSlotSwitcher,
  StoreFinder,
  StockInfoLists,
} from './components';

// CONSTANTS
export {
  PRODUCT_FULFILLMENT_SELECTOR,
  PRODUCT_LOCATION_STOCK_INFO,
  DIRECT_SHIP,
  DIRECT_SHIP_LABEL,
  IN_STORE_PICKUP_BOPIS_LABEL,
  IN_STORE_PICKUP_ROPIS_LABEL,
  ROPIS,
  BOPIS,
  DEFAULT_ROPE_FULFILLMENT_METHOD,
  QUICK_RESERVE,
  MULTI_LINE_RESERVE,
  STAGE_SELECT_STORE,
  STAGE_RESERVE_FORM,
  STAGE_RESPONSE_SUCCESS,
  STAGE_RESPONSE_ERROR,
  STAGE_FULFILLMENT_METHOD,
  STORE_FINDER_PATTERN,
} from './constants';

// SELECTORS
export * from './selectors';

// STREAMS
export {
  submitReservationSuccess$,
  preferredLocationDidUpdate$,
  preferredLocationDidUpdateGlobal$,
  preferredLocationDidUpdateGlobalNotOnCategory$,
  preferredLocationDidUpdateGlobalOnCategory$,
  preferredLocationDidUpdateGlobalNotOnSearch$,
  preferredLocationDidUpdateGlobalOnSearch$,
} from './locations.streams';

// HOOKS
export {
  useFulfillmentState,
} from './locations.hooks';

// TYPES
export type {
  LocationAddress,
  Location,
  LocationsByIdState,
  LocationsByProductIdState,
  FulfillmentPath,
  UserLocationState,
  ReservationFormValues,
  UserLocationFulfillmentMethod,
  UserLocationLocationCode,
  UserFormInputState,
  LocationsState,
  SheetStage,
  SheetCallbackFn,
  SheetOpenParams,
  ReservationResponse,
  LocationOperationHours,
  LocationAware,
  OptionalLocationAware,
} from './locations.types';

// CONTEXT
export { FulfillmentContext } from './locations.context';
