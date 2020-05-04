// @flow
import * as React from 'react';
import { type Product } from '@shopgate/engage/product';
import { type ItemFulfillment } from '../../cart.types';

export type CartItemProduct = {
  id: string,
  product: Product,
  quantity: number,
  messages: any[],
  fulfillment?: ItemFulfillment,
}

export type OwnProps = {
  cartItem: CartItemProduct,
  onToggleFocus?: (isEnabled: boolean) => void,
  isEditable?: boolean,
  children?: React.Node
}

export type StateProps = {
  isIos?: boolean,
  currency: string,
}

export type DispatchProps = {
  deleteProduct?: (cartItemId: string) => Promise<any>,
  updateProduct?: (cartItemId: String, quantity: number) => Promise<any>,
}
