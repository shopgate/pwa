// @flow
import { createContext } from 'react';
import { type Product } from '../product/product.types';
import {
  type Location,
  type ReservationFormValues,
  type SheetStage,
  type FulfillmentPath,
  type SheetOpenParams,
  type SheetCallbackFn,
} from './locations.types';
import { STAGE_SELECT_STORE } from './constants';
import { type ShopSettings } from '../core/config/config.types';

export type FulfillmentContextProps = {
  selectLocation: (location: Location) => Promise<void>,
  selectStoreFinderLocation: (location: Location) => void,
  changeFulfillment: (method: string, cartItem: { [string]: any }) => void,
  sendReservation: (values: ReservationFormValues) => Promise<void>,
  isStage: (stage: SheetStage) => boolean,
  handleOpen: (params: SheetOpenParams) => void,
  setIsLoading: (params: boolean) => void,
  handleClose: SheetCallbackFn,
  location: Location | null, // current product location
  storeFinderLocation: Location | null, // current product location
  locations: Location[] | null,
  orderNumbers: string[] | null,
  baseProduct: Product | null,
  product: Product | null,
  userInput: ReservationFormValues | null,
  stage: SheetStage | null,
  title: string | null,
  fulfillmentPath: FulfillmentPath | null,
  fulfillmentMethods: string[] | null,
  enabledFulfillmentMethods: string[] | null,
  shopSettings: ShopSettings | null,
  isOpen: boolean,
  errors: string[] | null,
  noLocationSelection?: boolean,
  isStoreFinder?: boolean,
  isLoading?: boolean,
  meta?: { [string]: any },
}

export const FulfillmentContext = createContext<FulfillmentContextProps>({
  selectLocation() { return Promise.resolve(); },
  selectStoreFinderLocation() { },
  changeFulfillment() { },
  sendReservation() { return Promise.resolve(); },
  isStage() { return false; },
  handleOpen() { },
  handleClose() { },
  setIsLoading() { },
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
});

export type StoreFinderContextProps = {};

export const StoreFinderContext = createContext<StoreFinderContextProps>({});
