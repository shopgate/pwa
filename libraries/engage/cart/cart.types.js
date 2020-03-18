// @flow
import { type ProductId } from '../product';

export type AddToCartProduct = {
  productId: ProductId;
  quantity: number;
  fulfillment?: {
    method: string;
    location: {
      code: string;
      name: string;
    }
  }
}

export type CartItem = {
  cartItemId?: string,
  id?: string,
  quantity: number,
  type: string,
  fulfillment?: {
    method: string;
    location: {
      code: string;
      name: string;
    }
  },
  fulfillmentLocationId?: string,
}
