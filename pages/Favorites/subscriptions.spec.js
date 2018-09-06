import {
  favoritesWillEnter$,
  favoritesWillRemoveItem$,
} from '@shopgate/pwa-common-commerce/favorites/streams';
import { FAVORITES_PATH } from '@shopgate/pwa-common-commerce/favorites/constants';
import subscribe from './subscriptions';

jest.mock('./constants', () => ({
  FAVORITES_SHOW_TOAST_DELAY: 0,
}));

describe('Favorites subscriptions', () => {
  let subscribeMock;
  let willEnter;
  let willRemoveItem;

  beforeAll(() => {
    subscribeMock = jest.fn();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    subscribe(subscribeMock);
    [willEnter, willRemoveItem] = subscribeMock.mock.calls;
  });

  it('should subscribe', () => {
    expect(subscribeMock).toHaveBeenCalledTimes(2);
    expect(willEnter[0]).toBe(favoritesWillEnter$);
    expect(willRemoveItem[0]).toBe(favoritesWillRemoveItem$);
  });

  describe('favoritesWillRemoveItem$', () => {
    it('should return when currentPath is not favorites page', () => {
      /**
       * Get state function.
       * @returns {Object}
       */
      const getState = () => ({
        history: {
          pathname: 'foo',
        },
      });

      // Didn't pass dispatch. If won't return early, exception would be thrown.
      expect(willRemoveItem[1]({ getState })).toBe(undefined);
    });

    it('should dispatch create toast action', (done) => {
      /**
       * Get state function.
       * @returns {Object}
       */
      const getState = () => ({
        history: {
          pathname: FAVORITES_PATH,
        },
      });

      const action = {
        productId: 123,
      };
      const dispatch = jest.fn();
      const events = {
        emit: jest.fn(),
      };

      willRemoveItem[1]({
        action,
        getState,
        dispatch,
        events,
      });

      setTimeout(() => {
        dispatch.mock.calls[0][0](dispatch);
        expect(typeof dispatch.mock.calls[1][0] === 'object').toBe(true);
        done();
      }, 1);
    });
  });
});
