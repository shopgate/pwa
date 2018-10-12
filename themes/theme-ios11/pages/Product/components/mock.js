import {
  basicProductState as bpState,
  productRouteMock,
  getShippingStateForId,
} from '@shopgate/pwa-common-commerce/product/mock';
import { getReviewsStateForId } from '@shopgate/pwa-common-commerce/reviews/mock';

const { productId } = bpState.product.currentProduct;

const product = {
  ...bpState.product,
  ...getShippingStateForId(productId),
};
const basicProductState = {
  ...bpState,
  ...getReviewsStateForId(productId),
  product,
  router: {
    routing: false,
    stack: [{ ...productRouteMock }],
  },
  favorites: {
    products: {
      lastChange: 0,
      lastFetch: 0,
      expires: 99999999999999,
      ids: [],
      isFetching: false,
      ready: true,
    },
  },
};

export { basicProductState };
