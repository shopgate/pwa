import 'rxjs/add/operator/debounceTime';
import event from '@shopgate/pwa-core/classes/Event';
import pipelineDependencies from '@shopgate/pwa-core/classes/PipelineDependencies';
import { userDidUpdate$ } from '@shopgate/pwa-common/streams/user';
import { appDidStart$ } from '@shopgate/pwa-common/streams/app';
import { routeDidEnter } from '@shopgate/pwa-common/streams/history';
import resetHistory from '@shopgate/pwa-common/actions/history/resetHistory';
import setViewLoading from '@shopgate/pwa-common/actions/view/setViewLoading';
import unsetViewLoading from '@shopgate/pwa-common/actions/view/unsetViewLoading';
import showModal from '@shopgate/pwa-common/actions/modal/showModal';
import { getHistoryLength, getHistoryPathname } from '@shopgate/pwa-common/selectors/history';
import { INDEX_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import fetchRegisterUrl from '@shopgate/pwa-common/actions/user/fetchRegisterUrl';
import * as pipelines from '../constants/Pipelines';
import addCouponsToCart from '../actions/addCouponsToCart';
import fetchCart from '../actions/fetchCart';
import {
  cartRequesting$,
  cartReceived$,
  productsAdded$,
  productsModified$,
  productsUpdated$,
  productsDeleted$,
  couponsAdded$,
  couponsUpdated$,
  couponsDeleted$,
  couponLinkOpened$,
  couponActionPushNotification$,
  remoteCartDidUpdate$,
} from '../streams';
import setCartProductPendingCount from '../action-creators/setCartProductPendingCount';
import { CART_PATH } from '../constants';
import { checkoutSucceeded$ } from '../../checkout/streams';

/**
 * Cart subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function cart(subscribe) {
  /**
   * Gets triggered when ever the local cart is out of
   * sync with the remote cart from the server. It's debounced to reduce emitting.
   */
  const cartNeedsSync$ = userDidUpdate$.merge(remoteCartDidUpdate$).debounceTime(0);

  /**
   * Gets triggered when the app is started or the cart route is entered.
   */
  const cartDidEnterOrAppDidStart$ = routeDidEnter(CART_PATH).merge(appDidStart$);

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

  // Cart is requested on viewWillAppear
  const cartIdleCouponLinkOpened$ = cartIdle$.zip(couponLinkOpened$).map(([, second]) => second);
  const cartIdleCouponActionPushNotification$ = cartIdle$
    .zip(couponActionPushNotification$)
    .map(([, second]) => second);

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
  });

  subscribe(cartIdle$, ({ dispatch }) => {
    dispatch(unsetViewLoading(CART_PATH));
  });

  /**
   * Gets triggered a coupon link was opened.
   */
  subscribe(cartIdleCouponLinkOpened$, ({ action, dispatch }) => {
    dispatch(addCouponsToCart([action.options.queryParams.coupon]));
  });

  /**
   * Gets triggered when a push notification containing a coupon link was received.
   */
  subscribe(cartIdleCouponActionPushNotification$, (options) => {
    const {
      action,
      code,
      dispatch,
      getState,
    } = options;
    const state = getState();
    const historyLength = getHistoryLength(state);
    const historyPathname = getHistoryPathname(state);

    /**
     * Check if the history only has one entry that is the push notification url.
     * Then reset back to the homepage.
     */
    if (historyLength === 1 && historyPathname === action.options.url) {
      dispatch(resetHistory(INDEX_PATH));
    }

    dispatch(addCouponsToCart([code]));
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
   * Gets triggered, when the checkout was completed
   */
  subscribe(checkoutSucceeded$, ({ dispatch }) => {
    dispatch(resetHistory());
    dispatch(fetchCart());
  });
}
