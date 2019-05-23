import { ROUTE_WILL_ENTER } from '@shopgate/engage/core';
import {
  ITEM_PATTERN,
  ITEM_REVIEWS_PATTERN,
  ITEM_WRITE_REVIEW_PATTERN,
} from '@shopgate/engage/product';
import { productRoutesWillEnter$, reviewsRouteWillEnter$ } from './streams';

describe('WriteReviews streams', () => {
  describe('productRoutesWillEnter$', () => {
    it('should return true', () => {
      const patterns = [
        ITEM_PATTERN,
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
