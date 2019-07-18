import { redirects } from '@shopgate/pwa-common/collections';
import { appWillStart$ } from '@shopgate/pwa-common/streams/app';
import { hasProductVariety } from '@shopgate/pwa-common-commerce/product';
import { historyReplace } from '@shopgate/pwa-common/actions/router';
import addCouponsToCart from '../actions/addCouponsToCart';
import addProductsToCart from '../actions/addProductsToCart';
import {
  CART_PATH,
  DEEPLINK_CART_ADD_COUPON_PATTERN,
  DEEPLINK_CART_ADD_PRODUCT_PATTERN,
} from '../constants';
import { routeAddProductNavigate$, routeWithCouponWillEnter$ } from '../streams';
import subscription from './index';

jest.mock('@shopgate/pwa-common-commerce/product', () => ({
  getProductRoute: jest.fn(productId => productId),
  hasProductVariety: jest.fn(),
}));
jest.mock('@shopgate/pwa-common/actions/router', () => ({
  historyReplace: jest.fn(),
}));

jest.mock('../actions/addCouponsToCart', () => jest.fn());
jest.mock('../actions/addProductsToCart', () => jest.fn());

describe('Cart subscriptions', () => {
  const subscribe = jest.fn();
  const dispatch = jest.fn().mockImplementation(action => action);
  const getState = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    subscription(subscribe);
  });

  describe('appWillStart$', () => {
    let stream;
    let callback;

    const redirectsSetSpy = jest.spyOn(redirects, 'set');

    beforeEach(() => {
      [[stream, callback]] = subscribe.mock.calls;
    });

    it('should subscribe as expected', () => {
      expect(stream).toEqual(appWillStart$);
      expect(callback).toBeInstanceOf(Function);
    });

    it('should setup a redirect handler for cart_add_coupon deeplinks', () => {
      callback();

      expect(redirectsSetSpy).toHaveBeenCalledTimes(2);
      expect(redirectsSetSpy.mock.calls).toEqual([
        [DEEPLINK_CART_ADD_COUPON_PATTERN, expect.any(Function)],
        [DEEPLINK_CART_ADD_PRODUCT_PATTERN, expect.any(Function)],
      ]);
    });

    it('should dispatch the addCouponsToCart action when a cart_add_coupon deeplink was opened', () => {
      callback();
      const coupon = '10PERCENTOFF';
      const action = {
        params: {
          pathname: `/cart_add_coupon/${coupon}?get=parameter`,
        },
      };

      const handlerResult = redirects.get(DEEPLINK_CART_ADD_COUPON_PATTERN)({
        dispatch,
        action,
      });

      expect(handlerResult).toBeNull();
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(addCouponsToCart).toHaveBeenCalledTimes(1);
      expect(addCouponsToCart).toHaveBeenCalledWith([coupon]);
    });
  });

  describe('routeWithCouponWillEnter$', () => {
    let stream;
    let callback;

    beforeEach(() => {
      [,,,,,,, [stream, callback]] = subscribe.mock.calls;
    });

    it('should subscribe as expected', () => {
      expect(stream).toEqual(routeWithCouponWillEnter$);
      expect(callback).toBeInstanceOf(Function);
    });

    it('should dispatch the addCouponsToCart action', () => {
      const coupon = '10PERCENTOFF';
      const action = {
        route: {
          query: {
            coupon,
          },
        },
      };

      callback({
        dispatch,
        action,
      });

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(addCouponsToCart).toHaveBeenCalledTimes(1);
      expect(addCouponsToCart).toHaveBeenCalledWith([coupon]);
    });
  });

  describe('routeAddProductNavigate$', () => {
    let stream;
    let callback;

    const action = { productId: 'prod1' };

    beforeEach(() => {
      [,,,,,,,, [stream, callback]] = subscribe.mock.calls;
    });

    it('should subscribe as expected', () => {
      expect(stream).toEqual(routeAddProductNavigate$);
      expect(callback).toBeInstanceOf(Function);
    });

    it('should navigate to PDP when product has variety', () => {
      hasProductVariety.mockReturnValueOnce(true);
      callback({
        dispatch,
        action,
        getState,
      });

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(historyReplace).toHaveBeenCalledTimes(1);
      expect(historyReplace).toHaveBeenCalledWith({
        pathname: action.productId,
      });
    });
    it('should navigate to cart when product has no variety', () => {
      hasProductVariety.mockReturnValueOnce(false);
      callback({
        dispatch,
        action,
        getState,
      });

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(addProductsToCart).toHaveBeenCalledWith([{
        productId: action.productId,
        quantity: 1,
      }]);
      expect(historyReplace).toHaveBeenCalledWith({
        pathname: CART_PATH,
      });
    });
  });
});
