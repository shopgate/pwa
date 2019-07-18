import { createMockStore } from '@shopgate/pwa-common/store';
import { ACTION_PUSH, ACTION_POP, ACTION_REPLACE } from '@virtuous/conductor';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import { routeWillEnter, navigate } from '@shopgate/pwa-common/action-creators/router';
import receiveCart from '@shopgate/pwa-common-commerce/cart/action-creators/receiveCart';
import { getCurrentPathname } from '@shopgate/pwa-common/selectors/router';
import {
  routeWithCouponWillEnter$,
  cartUpdatedWhileVisible$,
  routeAddProductNavigate$,
} from './index';

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

  describe('routeAddProductNavigate$', () => {
    let subscriber;
    beforeEach(() => {
      subscriber = jest.fn();
      routeAddProductNavigate$.subscribe(subscriber);
    });

    it('should not emit when navigate does not map pattern', () => {
      dispatch(navigate({ pathname: '/some_path' }));
      expect(subscriber).not.toHaveBeenCalled();
    });

    it('should emit and map event correctly', () => {
      dispatch(navigate({ pathname: '/cart_add_product/345%2F34%23/TEST-CODE' }));
      expect(subscriber).toHaveBeenCalledTimes(1);
      expect(subscriber).toHaveBeenCalledWith(expect.objectContaining({
        action: expect.objectContaining({
          productId: '345/34#',
          couponCode: 'TEST-CODE',
        }),
      }));
    });

    it('should emit and map event without coupon correctly', () => {
      dispatch(navigate({ pathname: '/cart_add_product/345%2F34%23' }));
      expect(subscriber).toHaveBeenCalledTimes(1);
      expect(subscriber).toHaveBeenCalledWith(expect.objectContaining({
        action: expect.objectContaining({
          productId: '345/34#',
          couponCode: undefined,
        }),
      }));
    });
  });
});
