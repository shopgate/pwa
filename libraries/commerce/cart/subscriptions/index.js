import 'rxjs/add/operator/debounceTime';
import event from '@shopgate/pwa-core/classes/Event';
import registerEvents from '@shopgate/pwa-core/commands/registerEvents';
import pipelineDependencies from '@shopgate/pwa-core/classes/PipelineDependencies';
import { redirects } from '@shopgate/pwa-common/collections';
import { userDidUpdate$ } from '@shopgate/pwa-common/streams/user';
import { appWillStart$, appDidStart$ } from '@shopgate/pwa-common/streams/app';
import { historyReset } from '@shopgate/pwa-common/actions/router';
import setViewLoading from '@shopgate/pwa-common/actions/view/setViewLoading';
import unsetViewLoading from '@shopgate/pwa-common/actions/view/unsetViewLoading';
import showModal from '@shopgate/pwa-common/actions/modal/showModal';
import fetchRegisterUrl from '@shopgate/pwa-common/actions/user/fetchRegisterUrl';
import { LoadingProvider } from '@shopgate/pwa-common/providers';
import * as pipelines from '../constants/Pipelines';
import addCouponsToCart from '../actions/addCouponsToCart';
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
} from '../streams';
import setCartProductPendingCount from '../action-creators/setCartProductPendingCount';
import { CART_PATH, DEEPLINK_CART_ADD_COUPON_PATTERN } from '../constants';

/**
 * Cart subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function cart(subscribe) {
  /**
   * Gets triggered when ever the local cart is out of
   * sync with the remote cart from the server.
   */
  const cartNeedsSync$ = userDidUpdate$.merge(remoteCartDidUpdate$);

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
        dispatch(addCouponsToCart([coupon]));
      }

      return null;
    });
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

    // Register for the app event that is triggered when the checkout process is finished
    registerEvents(['checkoutSuccess']);

    event.addCallback('checkoutSuccess', () => {
      dispatch(historyReset());
      dispatch(fetchCart());
    });

    /**
     * Reload the cart everytime the WebView becomes visible.
     * This is needed, for example, when the cart is modified inside the webcheckout and
     * the user closes the inAppBrowser before reaching the success page.
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

  subscribe(cartBusy$, ({ dispatch }) => {
    dispatch(setViewLoading(CART_PATH));
    LoadingProvider.setLoading(CART_PATH);
  });

  subscribe(cartIdle$, ({ dispatch }) => {
    dispatch(unsetViewLoading(CART_PATH));
    LoadingProvider.unsetLoading(CART_PATH);
  });

  subscribe(cartDidEnterOrAppDidStart$, ({ dispatch }) => {
    dispatch(fetchRegisterUrl())
      .catch(e => e);
  });

  subscribe(remoteCartDidUpdate$, ({ dispatch, action }) => {
    const { errors } = action;

    if (Array.isArray(errors) && errors.length) {
      errors.forEach((entry) => {
        const { message } = entry;

        dispatch(showModal({
          confirm: null,
          title: 'modal.title_error',
          message,
        }));
      });
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
}
