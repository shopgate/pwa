// @flow

export type ProductId = string;

// TODO: Finish product type.
export type Product = {
  id: ProductId;
}

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
  cartItemId: string,
  quantity: number,
  fulfillment?: {
    method: string;
    location: {
      code: string;
      name: string;
    }
  }
}
