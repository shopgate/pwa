// @flow
import * as React from 'react';
import { type AddToCartProduct, type Item } from '../../cart';
import { type ShopSettings } from '../../core/config/config.types';
import { type Product, type BaseProductAware, type ProductAware } from '../../product';
import {
  type Location,
  type ReservationFormValues,
  type ReservationResponse,
  type SheetStage,
} from '../locations.types';

export type OwnProps = {
  children: React.Node,
  open?: boolean,
  title?: string,
  changeOnly?: boolean,
  onClose?: (
    location: Location | null,
    productId: string | null,
    orderSuccess?: boolean | null
  ) => void,
  meta?: { [string]: any },
  stage?: SheetStage,
  updatePreferredLocation?: boolean,
  restrictMultiLocationOrders?: boolean,
  isCart?: boolean,
  cartProducts?: Array<Object>,
  fulfillmentSchedulingEnabled?: boolean,
  activeFulfillmentSlotLocationCode?: string,
  activeFulfillmentSlot?: Object
};

export type StateProps = {
  locations: Location[] | null,
  userInput: ReservationFormValues | null,
  fulfillmentPaths: string[],
  fulfillmentMethods?: string[],
  shopSettings?: ShopSettings,
  inventory: any,
} & ProductAware & BaseProductAware

export type DispatchProps = {
  selectLocation: (location: Location) => void,
  submitReservation: (
    values: ReservationFormValues,
    product: Product | null
  ) => Promise<ReservationResponse>,
  storeFormInput: (values: ReservationFormValues) => void,
  addProductsToCart: (data: AddToCartProduct[]) => void,
  updateProductsInCart: (data: Item[]) => void,
}
