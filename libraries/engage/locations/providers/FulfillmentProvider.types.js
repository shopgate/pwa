// @flow
import * as React from 'react';
import { type Product, type AddToCartProduct } from '../../product/product.types';
import {
  type Location,
  type ReservationFormValues,
  type ReservationResponse,
} from '../locations.types';

export type OwnProps = {
  children: React.Node,
}

export type StateProps = {
  locations: Location[],
  product: Product | null,
  userInput: ReservationFormValues | null,
  fulfillmentPaths: string[],
}

export type DispatchProps = {
  selectLocation: (location: Location) => void,
  submitReservation: (
    values: ReservationFormValues,
    product: Product | null
  ) => Promise<ReservationResponse>,
  storeFormInput: (values: ReservationFormValues) => void,
  addProductsToCart: (data: AddToCartProduct[]) => void,
}
