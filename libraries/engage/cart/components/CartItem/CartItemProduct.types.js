// @flow
import { type Product } from '@shopgate/engage/product';
import { type ItemFulfillment } from '../../cart.types';

export type OwnProps = {
  id: string,
  fulfillment?: ItemFulfillment,
  onToggleFocus?: (isEnabled: boolean) => void,
  messages: any[],
  product: Product,
  quantity: number,
  updateProduct?: (id: string, quantity: number) => void,
  editable?: boolean
}

export type StateProps = {
  isIos?: boolean,
  currency: string,
}

export type DispatchProps = {
  deleteProduct?: (cartItemId: string) => Promise<any>,
  updateProduct?: (cartItemId: String, quantity: number) => Promise<any>,
}
