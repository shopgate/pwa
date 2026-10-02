import { ROUTE_WILL_ENTER } from '@shopgate/pwa-common/constants/ActionTypes';
import {
  ITEM_PATTERN,
  ITEM_REVIEWS_PATTERN,
  ITEM_WRITE_REVIEW_PATTERN,
} from '@shopgate/pwa-common-commerce/product/constants';
import { writeReviewRouteWillEnter$, reviewsRouteWillEnter$ } from './streams';

describe('WriteReviews streams', () => {
  describe('writeReviewRouteWillEnter$', () => {
    it('should return true for the write review route', () => {
      const action = {
        type: ROUTE_WILL_ENTER,
        route: {
          pattern: ITEM_WRITE_REVIEW_PATTERN,
        },
      };
      const willEnter = writeReviewRouteWillEnter$.operator.predicate({ action });
      expect(willEnter).toBe(true);
    });

    it('should return false for the product and reviews routes', () => {
      [ITEM_PATTERN, ITEM_REVIEWS_PATTERN, 'some_other/pattern'].forEach((pattern) => {
        const action = {
          type: ROUTE_WILL_ENTER,
          route: {
            pattern,
          },
        };
        const willEnter = writeReviewRouteWillEnter$.operator.predicate({ action });
        expect(willEnter).toBe(false);
      });
    });
  });

  describe('reviewsRouteWillEnter$', () => {
    it('should return true', () => {
      const patterns = [
        ITEM_REVIEWS_PATTERN,
        ITEM_WRITE_REVIEW_PATTERN,
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
          pattern: ITEM_PATTERN,
        },
      };
      const willEnter = reviewsRouteWillEnter$.operator.predicate({ action });
      expect(willEnter).toBe(false);
    });
  });
});
