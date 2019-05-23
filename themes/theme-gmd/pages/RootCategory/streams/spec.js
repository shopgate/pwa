import { ROUTE_WILL_ENTER } from '@shopgate/engage/core';
import { CATEGORY_PATH } from '@shopgate/engage/category';
import { rootCategoryWillEnter$ } from './';

describe('RootCategory streams', () => {
  describe('rootCategoryWillEnter$', () => {
    it('should return true', () => {
      const action = {
        type: ROUTE_WILL_ENTER,
        route: {
          pattern: CATEGORY_PATH,
        },
      };
      const willEnter = rootCategoryWillEnter$.operator.predicate({ action });
      expect(willEnter).toBe(true);
    });

    it('should return false', () => {
      const action = {
        type: ROUTE_WILL_ENTER,
        route: {
          pattern: 'some_other/pattern',
        },
      };
      const willEnter = rootCategoryWillEnter$.operator.predicate({ action });
      expect(willEnter).toBe(false);
    });
  });
});
