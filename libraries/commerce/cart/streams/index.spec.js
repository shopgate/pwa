import { createMockStore } from '@shopgate/pwa-common/store';
import { HISTORY_PUSH_ACTION, HISTORY_POP_ACTION } from '@shopgate/pwa-common/constants/ActionTypes';
import { routeWillEnter } from '@shopgate/pwa-common/action-creators/router';
import { routeWithCouponWillEnter$ } from './index';

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
      }, HISTORY_PUSH_ACTION));

      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it('should not emit when a route will enter without a coupon in its query', () => {
      dispatch(routeWillEnter({
        query: {},
      }, HISTORY_PUSH_ACTION));

      expect(subscriber).not.toHaveBeenCalled();
    });

    it('should not emit when a route will enter by a HISTORY_POP history action', () => {
      dispatch(routeWillEnter({
        query: {
          coupon: '10PERCENTOFF',
        },
      }, HISTORY_POP_ACTION));

      expect(subscriber).not.toHaveBeenCalled();
    });
  });
});
