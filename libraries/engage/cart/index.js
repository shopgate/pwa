// @flow
/** @module cart */

// ACTIONS
export { default as addCouponsToCart } from '@shopgate/pwa-common-commerce/cart/actions/addCouponsToCart';
export { default as addProductsToCart } from '@shopgate/pwa-common-commerce/cart/actions/addProductsToCart';
export { default as deleteCouponsFromCart } from '@shopgate/pwa-common-commerce/cart/actions/deleteCouponsFromCart';
export { default as deleteProductsFromCart } from '@shopgate/pwa-common-commerce/cart/actions/deleteProductsFromCart';
export { default as fetchCart } from '@shopgate/pwa-common-commerce/cart/actions/fetchCart';
export { default as updateProductsInCart } from '@shopgate/pwa-common-commerce/cart/actions/updateProductsInCart';

// CONSTANTS
export * from '@shopgate/pwa-common-commerce/cart/constants/index';
export * from '@shopgate/pwa-common-commerce/cart/constants/PipelineErrors';
export * from '@shopgate/pwa-common-commerce/cart/constants/Pipelines';
export * from '@shopgate/pwa-common-commerce/cart/constants/Portals';
export {
  FLAG_ORDERABLE,
  FLAG_COUPONS,
  FLAG_TAX_INCLUDED,
  FLAG_MULTI_LINE_RESERVE,
  CART_MAX_ITEMS,
  CART_INPUT_AUTO_SCROLL_DELAY,
} from './cart.constants';

// HELPERS
export * from '@shopgate/pwa-common-commerce/cart/helpers';
export * from '@shopgate/pwa-common-commerce/cart/helpers/config';
export { default as createPipelineErrorList } from '@shopgate/pwa-common-commerce/cart/helpers/createPipelineErrorList';
export * from '@shopgate/pwa-common-commerce/cart/helpers/shipping';
export * from '@shopgate/pwa-common-commerce/cart/helpers/tax';
export {
  sortCartItems,
} from './cart.helpers';

// SELECTORS
export {
  getCartItems,
  getCartItemById,
  getCartProducts,
  getCartCoupons,
  getCartProductCount,
  getProductPendingCount,
  getCartProductDisplayCount,
  getOrderableStatus,
  getCurrency,
  getSubTotal,
  getGrandTotal,
  getShippingCost,
  getShippingCosts,
  getTax,
  getDiscounts,
  getDiscountsAmount,
  getCartMessages,
  getFlags,
  getAddToCartOptions,
  getAddToCartMetadata,
  hasCouponSupport,
  getIsFetching,
} from '@shopgate/pwa-common-commerce/cart/selectors';

export { makeIsAddToCartButtonDisabled } from './cart.selectors';

// STREAMS
export * from '@shopgate/pwa-common-commerce/cart/streams';

// CONTEXTS
export { CartContext } from './cart.context';

// COMPONENTS
export { PaymentBar } from './components/PaymentBar';
export {
  CartItemGroup,
  CartItems,
} from './components/CartItems';
export { CartItem } from './components/CartItem';

// HOOKS
export {
  useCartContext,
} from './cart.hooks';

// TYPES
export type {
  Item,
  AddToCartProduct,
} from './cart.types';
