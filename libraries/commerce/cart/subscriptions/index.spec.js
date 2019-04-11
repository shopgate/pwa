import { redirects } from '@shopgate/pwa-common/collections';
import { appWillStart$ } from '@shopgate/pwa-common/streams/app';
import addCouponsToCart from '../actions/addCouponsToCart';
import {
  DEEPLINK_CART_ADD_COUPON_PATTERN,
  DEEPLINK_CART_ADD_PRODUCT_PATTERN,
} from '../constants';
import { routeWithCouponWillEnter$ } from '../streams';
import subscription from './index';

jest.mock('../actions/addCouponsToCart', () => jest.fn());

describe('Cart subscriptions', () => {
  const subscribe = jest.fn();
  const dispatch = jest.fn().mockImplementation(action => action);

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
});
