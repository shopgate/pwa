import { createContext } from 'react';
import { STAGE_SELECT_STORE } from './constants';
/* eslint-disable max-len */
/** @typedef {import('@shopgate/engage/locations/locations.types').Location} Location */
/** @typedef {import('@shopgate/engage/locations/locations.types').ReservationFormValues} ReservationFormValues */
/** @typedef {import('@shopgate/engage/locations/locations.types').SheetStage} SheetStage */
/** @typedef {import('@shopgate/engage/locations/locations.types').FulfillmentPath} FulfillmentPath */
/** @typedef {import('@shopgate/engage/locations/locations.types').SheetOpenParams} SheetOpenParams */
/** @typedef {import('@shopgate/engage/locations/locations.types').SheetCallbackFn} SheetCallbackFn */
/** @typedef {import('../product/product.types').Product} Product */
/** @typedef {import('../core/config/config.types').ShopSettings} ShopSettings */
/* eslint-enable max-len */

/**
 * @typedef {Object} FulfillmentContextProps
 * @property {function(Location): Promise<void>} selectLocation
 * @property {function(Location): void} selectStoreFinderLocation
 * @property {(method: string, cartItem: Object<string, any>) => void} changeFulfillment
 * @property {function(ReservationFormValues): Promise<void>} sendReservation
 * @property {function(SheetStage): boolean} isStage
 * @property {function(SheetOpenParams): void} handleOpen
 * @property {(isLoading: boolean) => void} setIsLoading
 * @property {SheetCallbackFn} handleClose
 * @property {Location|null} location
 * @property {Location|null} storeFinderLocation
 * @property {Location[]|null} locations
 * @property {string[]|null} orderNumbers
 * @property {Product|null} baseProduct
 * @property {Product|null} product
 * @property {ReservationFormValues|null} userInput
 * @property {SheetStage|null} stage
 * @property {string|null} title
 * @property {FulfillmentPath|null} fulfillmentPath
 * @property {string[]|null} fulfillmentMethods
 * @property {string[]|null} enabledFulfillmentMethods
 * @property {ShopSettings|null} shopSettings
 * @property {boolean} isOpen
 * @property {string[]|null} errors
 * @property {boolean} [noLocationSelection]
 * @property {boolean} [isStoreFinder]
 * @property {boolean} [isLoading]
 * @property {Object} [meta]
 */

export const FulfillmentContext = createContext(/** @type {FulfillmentContextProps} */ ({
  selectLocation: () => Promise.resolve(),
  selectStoreFinderLocation: () => {},
  changeFulfillment: () => {},
  sendReservation: () => Promise.resolve(),
  isStage: () => false,
  handleOpen: () => {},
  handleClose: () => {},
  setIsLoading: () => {},
  location: null,
  storeFinderLocation: null,
  locations: [],
  orderNumbers: [],
  baseProduct: null,
  product: null,
  userInput: null,
  stage: STAGE_SELECT_STORE,
  title: null,
  fulfillmentPath: null,
  fulfillmentMethods: null,
  enabledFulfillmentMethods: null,
  shopSettings: null,
  isOpen: false,
  errors: null,
  noLocationSelection: false,
  isStoreFinder: false,
  isLoading: false,
}));

/**
 * @typedef {Object} StoreFinderContextProps
 */

export const StoreFinderContext = createContext(/** @type {StoreFinderContextProps} */ ({}));
