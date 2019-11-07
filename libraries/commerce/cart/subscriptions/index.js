import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';
import event from '@shopgate/pwa-core/classes/Event';
import pipelineDependencies from '@shopgate/pwa-core/classes/PipelineDependencies';
import { redirects } from '@shopgate/pwa-common/collections';
import { userDidUpdate$ } from '@shopgate/pwa-common/streams/user';
import { appWillStart$, appDidStart$ } from '@shopgate/pwa-common/streams/app';
import showModal from '@shopgate/pwa-common/actions/modal/showModal';
import fetchRegisterUrl from '@shopgate/pwa-common/actions/user/fetchRegisterUrl';
import { LoadingProvider } from '@shopgate/pwa-common/providers';
import { MODAL_PIPELINE_ERROR } from '@shopgate/pwa-common/constants/ModalTypes';
import { getProductRoute, hasProductVariety } from '@shopgate/pwa-common-commerce/product';
import { historyReplace } from '@shopgate/pwa-common/actions/router';
import { checkoutSucceeded$ } from '@shopgate/pwa-common-commerce/checkout';
import * as pipelines from '../constants/Pipelines';
import addCouponsToCart from '../actions/addCouponsToCart';
import addProductsToCart from '../actions/addProductsToCart';
import fetchCart from '../actions/fetchCart';
import {
  cartDidEnter$,
  cartRequesting$,
  cartReceived$,
  productsAdded$,
  productsModified$,
  productsUpdated$,
  productsDeleted$,
  couponsAdded$,
  couponsUpdated$,
  couponsDeleted$,
  routeWithCouponWillEnter$,
  remoteCartDidUpdate$,
  cartUpdateFailed$,
  routeAddProductNavigate$,
} from '../streams';
import setCartProductPendingCount from '../action-creators/setCartProductPendingCount';
import {
  CART_PATH,
  DEEPLINK_CART_ADD_COUPON_PATTERN,
  DEEPLINK_CART_ADD_PRODUCT_PATTERN,
  CART_ITEM_TYPE_PRODUCT,
} from '../constants';

/**
 * Cart subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function cart(subscribe) {
  /**
   * Gets triggered when ever the local cart is out of
   * sync with the remote cart from the server.
   */
  const cartNeedsSync$ = userDidUpdate$.merge(
    remoteCartDidUpdate$,
    checkoutSucceeded$
  );

  /**
   * Gets triggered when the app is started or the cart route is entered.
   */
  const cartDidEnterOrAppDidStart$ = cartDidEnter$.merge(appDidStart$);

  const cartBusy$ = cartRequesting$.merge(
    couponsAdded$,
    couponsDeleted$,
    productsAdded$,
    productsModified$,
    productsDeleted$
  );

  const cartIdle$ = cartReceived$.merge(
    couponsUpdated$,
    productsUpdated$
  );

  /**
   * Gets triggered when the app will start.
   */
  subscribe(appWillStart$, () => {
    // Use the redirect system to handle coupons from deeplinks.
    redirects.set(DEEPLINK_CART_ADD_COUPON_PATTERN, ({ dispatch, action }) => {
      const [, , coupon] = action.params.pathname.split('/');

      if (coupon) {
        dispatch(addCouponsToCart([coupon.split('?')[0]]));
      }

      return null;
    });
    // This will be handled in 2 deferred subscriptions
    redirects.set(DEEPLINK_CART_ADD_PRODUCT_PATTERN, () => null);
  });

  /**
   * Gets triggered when the app starts.
   */
  subscribe(appDidStart$, ({ dispatch }) => {
    pipelineDependencies.set(pipelines.SHOPGATE_CART_GET_CART, [
      pipelines.SHOPGATE_CART_ADD_PRODUCTS,
      pipelines.SHOPGATE_CART_UPDATE_PRODUCTS,
      pipelines.SHOPGATE_CART_DELETE_PRODUCTS,
      pipelines.SHOPGATE_CART_ADD_COUPONS,
      pipelines.SHOPGATE_CART_DELETE_COUPONS,
    ]);

    // Push (deeplink) with coupon concurrent to get cart on app start
    pipelineDependencies.set(pipelines.SHOPGATE_CART_ADD_COUPONS, [
      pipelines.SHOPGATE_CART_ADD_PRODUCTS,
      pipelines.SHOPGATE_CART_GET_CART,
    ]);
    pipelineDependencies.set(pipelines.SHOPGATE_CART_DELETE_COUPONS, [
      pipelines.SHOPGATE_CART_ADD_PRODUCTS,
      pipelines.SHOPGATE_CART_GET_CART,
    ]);

    /**
     * Reload the cart whenever the WebView becomes visible.
     * This is needed, for example, when the cart is modified from another inAppBrowser tab like a
     * web-checkout and the user closes the said tab before reaching the success page.
     */
    event.addCallback('viewWillAppear', () => {
      dispatch(fetchCart());
    });

    // Reset the productPendingCount on app start to avoid a wrong value in the cart badge.
    dispatch(setCartProductPendingCount(0));
  });

  subscribe(cartNeedsSync$, ({ dispatch }) => {
    dispatch(fetchCart());
  });

  subscribe(cartBusy$, () => {
    LoadingProvider.setLoading(CART_PATH);
  });

  subscribe(cartIdle$, () => {
    LoadingProvider.resetLoading(CART_PATH);
  });

  subscribe(cartDidEnterOrAppDidStart$, ({ dispatch }) => {
    dispatch(fetchRegisterUrl())
      .catch(e => e);
  });

  subscribe(cartUpdateFailed$, ({ dispatch, action }) => {
    /**
     * @type {PipelineErrorElement[]} errors
     */
    const { errors = [] } = action;

    if (Array.isArray(errors) && errors.length) {
      // Supports only one error, because none of the pipelines is ever called with multiple items.
      // Multiple errors would cause the this to overlay multiple modals on top of each other.
      const { message, handled } = errors[0];

      // Some errors are already handled automatically before
      if (handled) {
        return;
      }

      dispatch(showModal({
        confirm: 'modal.ok',
        dismiss: null,
        title: 'modal.title_error',
        message,
        type: MODAL_PIPELINE_ERROR,
        params: {
          ...errors[0],
        },
      }));
    }
  });

  /**
   * Gets triggered when a route with a coupon within its GET parameters will enter.
   */
  subscribe(routeWithCouponWillEnter$, ({ dispatch, action }) => {
    const { coupon } = action.route.query;

    if (coupon) {
      dispatch(addCouponsToCart([coupon]));
    }
  });

  /**
   * Deeplink to add product to cart, eg /cart_add_product/123
   */
  subscribe(routeAddProductNavigate$, ({ dispatch, action, getState }) => {
    // NO product or variety
    if (hasProductVariety(getState(), action)) {
      // Redirect to item page to select options/variant
      dispatch(historyReplace({
        pathname: getProductRoute(action.productId),
      }));
    } else {
      dispatch(addProductsToCart([{
        productId: action.productId,
        quantity: 1,
      }]));
      dispatch(historyReplace({
        pathname: CART_PATH,
      }));
    }
  });

  /**
   * Deffer coupon adding to a cart, until we have at least 1 product
   */
  const addCouponDeferred$ = routeAddProductNavigate$
    // Only if coupon is given
    .filter(({ action: { couponCode = '' } }) => !!couponCode)
    .withLatestFrom(cartReceived$)
    .switchMap(
      ([navigate, cartReceived]) => {
        if (cartReceived.action.cart.cartItems.find(i => i.type === CART_ITEM_TYPE_PRODUCT)) {
        // We have items in cart, add coupon immediately
          return Observable.of(navigate);
        }
        // Wait until first product in cart to add a coupon
        return cartReceived$.filter(cartReceivedNext => (
          cartReceivedNext.action.cart.cartItems.find(i => i.type === CART_ITEM_TYPE_PRODUCT)
        )).first();
      },
      ([navigate]) => navigate
    );

  /**
   * Deeplink to add product and coupon to cart, eg /cart_add_product/123/COUPON
   */
  subscribe(addCouponDeferred$, async ({ dispatch, action }) => {
    const { couponCode } = action;
    if (couponCode) {
      dispatch(addCouponsToCart([couponCode]));
    }
  });
}
