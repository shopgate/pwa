import { ROUTE_WILL_ENTER } from '@shopgate/pwa-common/constants/ActionTypes';
import { CATEGORY_PATH, RECEIVE_CATEGORY } from '@shopgate/pwa-common-commerce/category/constants';
import { categoryWillEnter$, receivedVisibleCategory$ } from './streams';

let mockedParams = {};
jest.mock('@virtuous/conductor-helpers/getCurrentRoute', () => () => ({ params: mockedParams }));

describe('Category streams', () => {
  describe('categoryWillEnter$', () => {
    it('should return true', () => {
      const patterns = [
        `${CATEGORY_PATH}/:categoryId`,
      ];

      patterns.forEach((pattern) => {
        const action = {
          type: ROUTE_WILL_ENTER,
          route: {
            pathname: `${CATEGORY_PATH}/123`,
            pattern,
          },
        };
        const willEnter = categoryWillEnter$.operator.predicate({ action });
        expect(willEnter).toBe(true);
      });
    });

    it('should return false', () => {
      const action = {
        type: ROUTE_WILL_ENTER,
        route: {
          pathname: CATEGORY_PATH,
          pattern: CATEGORY_PATH,
        },
      };
      const willEnter = categoryWillEnter$.operator.predicate({ action });
      expect(willEnter).toBe(false);
    });
  });

  describe('receivedVisibleCategory$', () => {
    it('should return true', () => {
      mockedParams = {
        categoryId: '666f6f',
      };
      const action = {
        type: RECEIVE_CATEGORY,
        categoryId: 'foo',
      };
      const receive = receivedVisibleCategory$.operator.predicate({ action });
      expect(receive).toBe(true);
    });

    it('should return false if different action', () => {
      const action = {
        type: ROUTE_WILL_ENTER,
        route: {
          pattern: `${CATEGORY_PATH}/:categoryId`,
        },
      };
      const receive = receivedVisibleCategory$.operator.predicate({ action });
      expect(receive).toBe(false);
    });

    it('should return false if no category id present', () => {
      const action = {
        type: RECEIVE_CATEGORY,
      };
      const receive = receivedVisibleCategory$.operator.predicate({ action });
      expect(receive).toBe(false);
    });

    it('should return false if no categoryIds differ', () => {
      mockedParams = {
        categoryId: 'foobar',
      };

      const action = {
        type: RECEIVE_CATEGORY,
        categoryId: '123',
      };
      const receive = receivedVisibleCategory$.operator.predicate({ action });
      expect(receive).toBe(false);
    });

    it('should return false if no category id is present in route', () => {
      mockedParams = {};

      const action = {
        type: RECEIVE_CATEGORY,
        categoryId: '123',
      };
      const receive = receivedVisibleCategory$.operator.predicate({ action });
      expect(receive).toBe(false);
    });
  });
});
