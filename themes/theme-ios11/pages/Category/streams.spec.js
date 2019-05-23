/* eslint-disable extra-rules/no-single-line-objects */
import { ROUTE_WILL_ENTER } from '@shopgate/engage/core';
import { CATEGORY_PATH, RECEIVE_CATEGORY, ERROR_CATEGORY } from '@shopgate/engage/category';
import { categoryWillEnter$, receivedVisibleCategory$, errorVisibleCategory$ } from './streams';

let mockedParams = {};
jest.mock('@shopgate/engage/core', () => ({
  getCurrentRoute: () => ({
    params: mockedParams,
  }),
}));

describe('Category streams', () => {
  const getState = jest.fn();

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
        const willEnter = categoryWillEnter$.operator.predicate({ action, getState });
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
      const willEnter = categoryWillEnter$.operator.predicate({ action, getState });
      expect(willEnter).toBe(false);
    });
  });

  describe.each([
    ['receivedVisibleCategory$', receivedVisibleCategory$, RECEIVE_CATEGORY],
    ['errorVisibleCategory$', errorVisibleCategory$, ERROR_CATEGORY]])(
    '%s',
    (name, stream$, actionType) => {
      it('should return true', () => {
        mockedParams = {
          categoryId: '666f6f',
        };
        const action = {
          type: actionType,
          categoryId: 'foo',
        };
        const receive = stream$.operator.predicate({ action, getState });
        expect(receive).toBe(true);
      });

      it('should return false if different action', () => {
        const action = {
          type: ROUTE_WILL_ENTER,
          route: {
            pattern: `${CATEGORY_PATH}/:categoryId`,
          },
        };
        const receive = stream$.operator.predicate({ action, getState });
        expect(receive).toBe(false);
      });

      it('should return false if no category id present', () => {
        const action = {
          type: actionType,
        };
        const receive = stream$.operator.predicate({ action, getState });
        expect(receive).toBe(false);
      });

      it('should return false if no categoryIds differ', () => {
        mockedParams = {
          categoryId: 'foobar',
        };

        const action = {
          type: actionType,
          categoryId: '123',
        };
        const receive = stream$.operator.predicate({ action, getState });
        expect(receive).toBe(false);
      });

      it('should return false if no category id is present in route', () => {
        mockedParams = {};

        const action = {
          type: actionType,
          categoryId: '123',
        };
        const receive = stream$.operator.predicate({ action, getState });
        expect(receive).toBe(false);
      });
    }
  );
});

/* eslint-enable extra-rules/no-single-line-objects */
