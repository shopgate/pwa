// @flow
import {
  COUPON_TYPE_FIXED,
  COUPON_TYPE_PERCENTAGE,
} from '@shopgate/pwa-common-commerce/cart';
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

export type ItemFulfillment = {
  method: string;
  location: {
    code?: string;
    name?: string;
  }
}

export type Item = {
  cartItemId?: string,
  id?: string,
  quantity: number,
  type?: string,
  fulfillment?: ItemFulfillment,
  fulfillmentLocationId?: string,
  fulfillmentMethod?: string,
  product?: { [string]: any },
  coupon?: any,
  messages?: any[],
}

export type SavedPrice = {
  type: typeof COUPON_TYPE_FIXED | typeof COUPON_TYPE_PERCENTAGE,
  value: number,
}

export type Coupon = {
  code: string,
  savedPrice?: SavedPrice,
  [string]: any,
}
