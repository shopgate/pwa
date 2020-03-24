// @flow
import * as React from 'react';
import { type ShopSettings } from '../../core/config';
import { type AddToCartProduct, type CartItem } from '../../cart';
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
  onClose?: (location: Location | null, productId: string | null, orderSuccess?: boolean) => void,
  meta?: { [string]: any },
  stage?: SheetStage,
}

export type StateProps = {
  locations: Location[] | null,
  userInput: ReservationFormValues | null,
  fulfillmentPaths: string[],
  fulfillmentMethods?: string[],
  shopSettings?: ShopSettings,
} & ProductAware & BaseProductAware

export type DispatchProps = {
  selectLocation: (location: Location) => void,
  submitReservation: (
    values: ReservationFormValues,
    product: Product | null
  ) => Promise<ReservationResponse>,
  storeFormInput: (values: ReservationFormValues) => void,
  addProductsToCart: (data: AddToCartProduct[]) => void,
  updateProductsInCart: (data: CartItem[]) => void,
}
