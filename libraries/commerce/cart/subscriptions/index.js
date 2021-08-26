import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/of';
import event from '@shopgate/pwa-core/classes/Event';
import pipelineDependencies from '@shopgate/pwa-core/classes/PipelineDependencies';
import { redirects } from '@shopgate/pwa-common/collections';
import { userDidUpdate$ } from '@shopgate/pwa-common/streams/user';
import { appWillStart$, appDidStart$ } from '@shopgate/pwa-common/streams/app';
import { parseObjectToQueryString } from '@shopgate/pwa-common/helpers/router';
import fetchRegisterUrl from '@shopgate/pwa-common/actions/user/fetchRegisterUrl';
import { LoadingProvider } from '@shopgate/pwa-common/providers';
import {
  fetchProductsById, getProductRoute, hasProductVariety, getProduct,
} from '@shopgate/pwa-common-commerce/product';
import { historyReplace } from '@shopgate/pwa-common/actions/router';
import { checkoutSucceeded$ } from '@shopgate/pwa-common-commerce/checkout';
import {
  DIRECT_SHIP,
  ROPIS,
  BOPIS,
  getPreferredLocation,
  getPreferredFulfillmentMethod,
} from '@shopgate/engage/locations';
import { makeGetEnabledFulfillmentMethods } from '@shopgate/engage/core/config';
import { errorBehavior } from '@shopgate/engage/core';
import * as pipelines from '../constants/Pipelines';
import addCouponsToCart from '../actions/addCouponsToCart';
import addProductsToCart from '../actions/addProductsToCart';
import updateProductsInCart from '../actions/updateProductsInCart';
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
  setFulfillmentSlot$,
  cartWillEnterIdle$,
} from '../streams';
import setCartProductPendingCount from '../action-creators/setCartProductPendingCount';
import {
  CART_PATH,
  DEEPLINK_CART_ADD_COUPON_PATTERN,
  DEEPLINK_CART_ADD_PRODUCT_PATTERN,
} from '../constants';
import { getCartProducts } from '../selectors';

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
    checkoutSucceeded$,
    cartWillEnterIdle$
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
        dispatch(addCouponsToCart([coupon.split('?')[0]], false));
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

  subscribe(setFulfillmentSlot$, ({ dispatch, getState, action }) => {
    // When the fulfillment slot is set we need to update all line items.
    let products = getCartProducts(getState());
    if (!products.length || !action?.fulfillmentSlot?.id) {
      return;
    }

    products = products
      .filter(product => [ROPIS, BOPIS].includes(product?.fulfillment?.method))
      .map(product => ({
        cartItemId: product.id,
        fulfillment: {
          slotId: action.fulfillmentSlot.id,
        },
      }));

    if (!products.length) {
      return;
    }

    // Update the slot id for ROPE products.
    dispatch(updateProductsInCart(products));
  });

  subscribe(cartIdle$, ({ dispatch, getState }) => {
    /** Fetch missing products of a cart */
    const productIds = getCartProducts(getState()).map(cartItem => cartItem.product.id);
    if (productIds.length) {
      dispatch(fetchProductsById(productIds));
    }
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
      const {
        message, handled, code, additionalParams, translated, context,
      } = errors[0];

      // Some errors are already handled automatically before
      if (handled) {
        return;
      }

      errorBehavior.modal()({
        dispatch,
        error: {
          code,
          context,
          meta: {
            message,
            additionalParams,
            translated,
          },
        },
      });
    }
  });

  /**
   * Gets triggered when a route with a coupon within its GET parameters will enter.
   */
  subscribe(routeWithCouponWillEnter$, ({ dispatch, action }) => {
    const { coupon } = action.route.query;

    if (coupon) {
      dispatch(addCouponsToCart([coupon], false));
      const { query, pathname } = action.route;
      const { coupon: c, ...rest } = query;

      dispatch(historyReplace({
        pathname: `${pathname}${parseObjectToQueryString(rest)}`,
      }));
    }
  });

  const getFulfillmentMethods = makeGetEnabledFulfillmentMethods();

  /**
   * Deeplink to add product to cart, eg /cart_add_product/123s
   */
  subscribe(routeAddProductNavigate$, async ({ dispatch, action, getState }) => {
    const state = getState();
    const product = getProduct(state, action);
    const preferredLocation = getPreferredLocation(state);
    const preferredFulfillmentMethod = getPreferredFulfillmentMethod(state);
    const shopFulfillmentMethods = getFulfillmentMethods(state);

    let redirectToPDP = false;
    let fulfillment = null;

    if (hasProductVariety(state, action)) {
      // NO product or variety
      redirectToPDP = true;
    } else if (preferredFulfillmentMethod !== DIRECT_SHIP) {
      let activeLocation = null;
      if (preferredLocation) {
        activeLocation = preferredLocation;
      }

      // Get fulfillment method that is both active for location and product.
      let activeFulfillmentMethod = preferredFulfillmentMethod;
      const availableFulfillmentMethods = shopFulfillmentMethods?.filter(
        s => product?.fulfillmentMethods.indexOf(s) || [] !== -1
      ) || [];

      if (activeLocation && !activeFulfillmentMethod && availableFulfillmentMethods.length === 1) {
        [activeFulfillmentMethod] = availableFulfillmentMethods;
      }

      if (!product?.fulfillmentMethods.includes(activeFulfillmentMethod) || false) {
        activeFulfillmentMethod = null;
      }

      if (!activeFulfillmentMethod || !activeLocation) {
        redirectToPDP = true;
      } else {
        fulfillment = {
          method: preferredFulfillmentMethod,
          location: {
            code: preferredLocation.code,
            name: preferredLocation.name || '',
          },
        };
      }
    }

    // NO product or variety
    if (redirectToPDP) {
      // Redirect to item page to select options/variant
      dispatch(historyReplace({
        pathname: getProductRoute(action.productId),
      }));
    } else {
      dispatch(addProductsToCart([{
        productId: action.productId,
        quantity: 1,
        ...(fulfillment ? { fulfillment } : {}),
      }]));
      dispatch(historyReplace({
        pathname: CART_PATH,
      }));
    }
  });

  /**
   * Deffer coupon adding to a cart, until we have at least 1 product
   */
  const addCoupon$ = routeAddProductNavigate$
    // Only if coupon is given
    .filter(({ action: { couponCode = '' } }) => !!couponCode);

  /**
   * Deeplink to add product and coupon to cart, eg /cart_add_product/123/COUPON
   */
  subscribe(addCoupon$, async ({ dispatch, action }) => {
    const { couponCode } = action;
    if (couponCode) {
      dispatch(addCouponsToCart([couponCode], false));
    }
  });
}
