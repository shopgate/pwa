// @flow
import * as React from 'react';
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

export type FulfillmentContextProps = {
  selectLocation: (location: Location) => void,
  sendReservation: (values: ReservationFormValues) => Promise<void>,
  isStage: (stage: SheetStage) => boolean,
  handleOpen: (params: SheetOpenParams) => void,
  handleClose: SheetCallbackFn,
  locations: Location[],
  orderNumbers: string[] | null,
  product: Product | null,
  userInput: ReservationFormValues | null,
  stage: SheetStage,
  title: string | null,
  fulfillmentPath: FulfillmentPath | null,
  isOpen: boolean,
  errors: string[] | null,
}

export const FulfillmentContext = React.createContext<FulfillmentContextProps>({
  selectLocation() { },
  sendReservation() { return Promise.resolve(); },
  isStage() { return false; },
  handleOpen() { },
  handleClose() { },
  locations: [],
  orderNumbers: [],
  product: null,
  userInput: null,
  stage: STAGE_SELECT_STORE,
  title: null,
  fulfillmentPath: null,
  isOpen: false,
  errors: null,
});
