import { ACTION_PUSH, ACTION_REPLACE } from '@virtuous/conductor';
import { main$ } from '@shopgate/pwa-common/streams/main';
import {
  routeWillEnter$,
  routeDidEnter$,
  routeWillLeave$,
  routeDidLeave$,
  navigate$,
} from '@shopgate/pwa-common/streams/router';
import { getCurrentPathname } from '@shopgate/pwa-common/selectors/router';
import {
  CART_PATH,

  REQUEST_CART,
  RECEIVE_CART,
  ERROR_CART,

  ADD_PRODUCTS_TO_CART,
  SUCCESS_ADD_PRODUCTS_TO_CART,
  ERROR_ADD_PRODUCTS_TO_CART,

  UPDATE_PRODUCTS_IN_CART,
  SUCCESS_UPDATE_PRODUCTS_IN_CART,
  ERROR_UPDATE_PRODUCTS_IN_CART,

  DELETE_PRODUCTS_FROM_CART,
  SUCCESS_DELETE_PRODUCTS_FROM_CART,
  ERROR_DELETE_PRODUCTS_FROM_CART,

  ADD_COUPONS_TO_CART,
  SUCCESS_ADD_COUPONS_TO_CART,
  ERROR_ADD_COUPONS_TO_CART,

  DELETE_COUPONS_FROM_CART,
  ERROR_DELETE_COUPONS_FROM_CART,
  SUCCESS_DELETE_COUPONS_FROM_CART,

  DEEPLINK_CART_ADD_PRODUCT_PATTERN,
} from '../constants';

/**
 * @type {Observable}
 */
export const routeWithCouponWillEnter$ = routeWillEnter$
  .filter(({ action }) =>
    [
      ACTION_PUSH,
      ACTION_REPLACE,
    ].includes(action.historyAction) && action.route.query.coupon);

/**
 * @type {Observable}
 */
export const cartWillEnter$ = routeWillEnter$
  .filter(({ action }) => action.route.pattern === CART_PATH);

/**
* @type {Observable}
*/
export const cartDidEnter$ = routeDidEnter$
  .filter(({ action }) => action.route.pattern === CART_PATH);

/**
 * @type {Observable}
 */
export const cartWillLeave$ = routeWillLeave$
  .filter(({ action }) => action.route.pattern === CART_PATH);

/**
 * @type {Observable}
 */
export const cartDidLeave$ = routeDidLeave$
  .filter(({ action }) => action.route.pattern === CART_PATH);

/**
 * @type {Observable}
 */
export const cartRequesting$ = main$.filter(({ action }) => (
  action.type === REQUEST_CART
));

/**
 * @type {Observable}
 */
export const cartReceived$ = main$.filter(({ action }) => (
  action.type === RECEIVE_CART ||
  action.type === ERROR_CART
));

/**
 * Gets triggered when the user tried to add a coupon to the cart.
 * @type {Observable}
 */
export const couponsAdded$ = main$.filter(({ action }) => (
  action.type === ADD_COUPONS_TO_CART
));

/**
 * Gets triggered when the user tried to add a coupon to the cart.
 * @type {Observable}
 */
export const couponsDeleted$ = main$.filter(({ action }) => (
  action.type === DELETE_COUPONS_FROM_CART
));

/**
 * Gets triggered when the user tried to add a coupon to the cart.
 * @type {Observable}
 */
export const couponsUpdated$ = main$.filter(({ action }) => (
  action.type === SUCCESS_ADD_COUPONS_TO_CART ||
  action.type === ERROR_ADD_COUPONS_TO_CART ||
  action.type === SUCCESS_DELETE_COUPONS_FROM_CART ||
  action.type === ERROR_DELETE_COUPONS_FROM_CART
));

/**
 * Gets triggered when the user tried to add a product to the cart.
 * @type {Observable}
 */
export const productsAdded$ = main$.filter(({ action }) => (
  action.type === ADD_PRODUCTS_TO_CART
));

/**
 * Gets triggered when the user tried to add a product to the cart.
 * @type {Observable}
 */
export const productsModified$ = main$.filter(({ action }) => (
  action.type === UPDATE_PRODUCTS_IN_CART
));

/**
 * Gets triggered when the user tried to add a product to the cart.
 * @type {Observable}
 */
export const productsDeleted$ = main$.filter(({ action }) => (
  action.type === DELETE_PRODUCTS_FROM_CART
));

/**
 * Gets triggered when the cart has been updated while the cart route was visible.
* @type {Observable}
 */
export const cartUpdatedWhileVisible$ = cartReceived$
  .filter(({ getState }) => getCurrentPathname(getState()) === CART_PATH);

/**
 * Gets triggered when the user tried to add a coupon to the cart.
 * @type {Observable}
 */
export const productsUpdated$ = main$.filter(({ action }) => (
  action.type === SUCCESS_ADD_PRODUCTS_TO_CART ||
  action.type === ERROR_ADD_PRODUCTS_TO_CART ||
  action.type === SUCCESS_UPDATE_PRODUCTS_IN_CART ||
  action.type === ERROR_UPDATE_PRODUCTS_IN_CART ||
  action.type === SUCCESS_DELETE_PRODUCTS_FROM_CART ||
  action.type === ERROR_DELETE_PRODUCTS_FROM_CART
));

/**
 * Gets triggered when the remote cart was updated.
 * @type {Observable}
 */
export const remoteCartDidUpdate$ = main$.filter(({ action }) => (
  action.type === SUCCESS_ADD_PRODUCTS_TO_CART ||
  action.type === ERROR_ADD_PRODUCTS_TO_CART ||
  action.type === SUCCESS_UPDATE_PRODUCTS_IN_CART ||
  action.type === ERROR_UPDATE_PRODUCTS_IN_CART ||
  action.type === SUCCESS_DELETE_PRODUCTS_FROM_CART ||
  action.type === ERROR_DELETE_PRODUCTS_FROM_CART ||
  action.type === SUCCESS_ADD_COUPONS_TO_CART ||
  action.type === ERROR_ADD_COUPONS_TO_CART ||
  action.type === SUCCESS_DELETE_COUPONS_FROM_CART ||
  action.type === ERROR_DELETE_COUPONS_FROM_CART
));

/**
 * Gets triggered whenever any cart update request fails.
 * @type {Observable}
 */
export const cartUpdateFailed$ = main$.filter(({ action }) => (
  action.type === ERROR_ADD_PRODUCTS_TO_CART ||
  action.type === ERROR_UPDATE_PRODUCTS_IN_CART ||
  action.type === ERROR_DELETE_PRODUCTS_FROM_CART ||
  action.type === ERROR_ADD_COUPONS_TO_CART ||
  action.type === ERROR_DELETE_COUPONS_FROM_CART
));

/**
 * Gets triggered when /cart_add_product/123/COUPON route is navigated
 * @type {Observable}
 */
export const routeAddProductNavigate$ = navigate$
  .filter(({ action: { params: { pathname = '' } = {} } }) => (
    pathname.includes(DEEPLINK_CART_ADD_PRODUCT_PATTERN.split('/')[1])
  ))
  .map((params) => {
    const [, , productId, couponCode] = params.action.params.pathname.split('/');
    return {
      ...params,
      action: {
        ...params.action,
        productId: decodeURIComponent(productId),
        couponCode: couponCode ? decodeURIComponent(couponCode) : undefined,
      },
    };
  });

