import { createMockStore } from '@shopgate/pwa-common/store';
import { ACTION_PUSH, ACTION_POP, ACTION_REPLACE } from '@virtuous/conductor';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import { routeWillEnter } from '@shopgate/pwa-common/action-creators/router';
import receiveCart from '@shopgate/pwa-common-commerce/cart/action-creators/receiveCart';
import { getCurrentPathname } from '@shopgate/pwa-common/selectors/router';
import { routeWithCouponWillEnter$, cartUpdatedWhileVisible$ } from './index';

jest.mock('@shopgate/pwa-common/selectors/router', () => ({ getCurrentPathname: jest.fn() }));

describe('Cart streams', () => {
  let dispatch;

  beforeEach(() => {
    jest.clearAllMocks();
    ({ dispatch } = createMockStore());
  });

  describe('routeWithCouponWillEnter$', () => {
    let subscriber;

    beforeEach(() => {
      subscriber = jest.fn();
      routeWithCouponWillEnter$.subscribe(subscriber);
    });

    it('should emit when a route will enter that has a coupon in its query', () => {
      dispatch(routeWillEnter({
        query: {
          coupon: '10PERCENTOFF',
        },
      }, ACTION_PUSH));

      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it('should emit when a route will enter that has a coupon in its query', () => {
      dispatch(routeWillEnter({
        query: {
          coupon: '10PERCENTOFF',
        },
      }, ACTION_REPLACE));

      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it('should not emit when a route will enter without a coupon in its query', () => {
      dispatch(routeWillEnter({
        query: {},
      }, ACTION_PUSH));

      expect(subscriber).not.toHaveBeenCalled();
    });

    it('should not emit when a route will enter by a ACTION_POP history action', () => {
      dispatch(routeWillEnter({
        query: {
          coupon: '10PERCENTOFF',
        },
      }, ACTION_POP));

      expect(subscriber).not.toHaveBeenCalled();
    });
  });

  describe('cartUpdatedWhileVisible$', () => {
    let subscriber;

    beforeEach(() => {
      subscriber = jest.fn();
      cartUpdatedWhileVisible$.subscribe(subscriber);
    });

    it('should not emit when updated while different page is visible', () => {
      getCurrentPathname.mockReturnValue('/something');
      dispatch(receiveCart({}));

      expect(subscriber).not.toHaveBeenCalled();
    });

    it('should emit when updated while cart page is visible', () => {
      getCurrentPathname.mockReturnValue(CART_PATH);
      dispatch(receiveCart({}));

      expect(subscriber).toHaveBeenCalled();
    });
  });
});
