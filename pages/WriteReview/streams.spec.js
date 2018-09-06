import { ROUTE_WILL_ENTER } from '@shopgate/pwa-common/constants/ActionTypes';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants';
import { productRoutesWillEnter$, reviewsRouteWillEnter$ } from './streams';

describe('WriteReviews streams', () => {
  describe('productRoutesWillEnter$', () => {
    it('should return true', () => {
      const patterns = [
        `${ITEM_PATH}/:productId`,
        `${ITEM_PATH}/:productId/reviews`,
        `${ITEM_PATH}/:productId/write_review`,
      ];

      patterns.forEach((pattern) => {
        const action = {
          type: ROUTE_WILL_ENTER,
          route: {
            pattern,
          },
        };
        const willEnter = productRoutesWillEnter$.operator.predicate({ action });
        expect(willEnter).toBe(true);
      });
    });

    it('should return false', () => {
      const action = {
        type: ROUTE_WILL_ENTER,
        route: {
          pattern: 'some_other/pattern',
        },
      };
      const willEnter = productRoutesWillEnter$.operator.predicate({ action });
      expect(willEnter).toBe(false);
    });
  });

  describe('reviewsRouteWillEnter$', () => {
    it('should return true', () => {
      const patterns = [
        `${ITEM_PATH}/:productId/reviews`,
        `${ITEM_PATH}/:productId/write_review`,
      ];
      patterns.forEach((pattern) => {
        const action = {
          type: ROUTE_WILL_ENTER,
          route: {
            pattern,
          },
        };
        const willEnter = reviewsRouteWillEnter$.operator.predicate({ action });
        expect(willEnter).toBe(true);
      });
    });

    it('should return false', () => {
      const action = {
        type: ROUTE_WILL_ENTER,
        route: {
          pattern: `${ITEM_PATH}/:productId`,
        },
      };
      const willEnter = reviewsRouteWillEnter$.operator.predicate({ action });
      expect(willEnter).toBe(false);
    });
  });
});
