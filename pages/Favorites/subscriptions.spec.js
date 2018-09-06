import ToastProvider from '@shopgate/pwa-common/providers/toast';
import setTitle from '@shopgate/pwa-common/actions/view/setTitle';
import { addFavorites } from '@shopgate/pwa-common-commerce/favorites/actions/toggleFavorites';
import {
  favoritesWillEnter$,
  favoritesWillRemoveItem$,
} from '@shopgate/pwa-common-commerce/favorites/streams';
import { FAVORITES_PATH } from '@shopgate/pwa-common-commerce/favorites/constants';
import subscribe from './subscriptions';

let mockedPattern;
jest.mock('@virtuous/conductor-helpers/getCurrentRoute', () => () => ({ pattern: mockedPattern }));
jest.mock('@shopgate/pwa-common/actions/view/setTitle', () => jest.fn().mockReturnValue('setTitle'));
jest.mock('@shopgate/pwa-common-commerce/favorites/actions/toggleFavorites', () => ({
  addFavorites: jest.fn().mockReturnValue('addFavorites'),
}));

jest.useFakeTimers();

describe('Favorites subscriptions', () => {
  const subscribeMock = jest.fn();
  let willEnter;
  let willRemoveItem;

  beforeEach(() => {
    mockedPattern = FAVORITES_PATH;
    jest.clearAllMocks();
    subscribe(subscribeMock);
    [willEnter, willRemoveItem] = subscribeMock.mock.calls;
  });

  it('should subscribe', () => {
    expect(subscribeMock).toHaveBeenCalledTimes(2);
  });

  describe('favoritesWillEnter$', () => {
    let stream;
    let callback;
    const dispatch = jest.fn();

    beforeEach(() => {
      [stream, callback] = willEnter;
    });

    it('should subscribe', () => {
      expect(subscribeMock).toHaveBeenCalledTimes(2);
      expect(stream).toBe(favoritesWillEnter$);
    });

    it('should set the title on enter', () => {
      callback({ dispatch });
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith(setTitle());
      expect(setTitle).toHaveBeenCalledWith('titles.favorites');
    });
  });

  describe('favoritesWillRemoveItem$', () => {
    let stream;
    let callback;

    const action = { productId: 'abc123' };
    const dispatch = jest.fn();
    const events = {
      emit: jest.fn(),
    };

    beforeEach(() => {
      [stream, callback] = willRemoveItem;
    });

    it('should subscribe', () => {
      expect(subscribeMock).toHaveBeenCalledTimes(2);
      expect(stream).toBe(favoritesWillRemoveItem$);
    });

    it('should do nothing when not on the favorites page', () => {
      mockedPattern = '/some/random/path';

      callback({
        action,
        dispatch,
        events,
      });

      expect(events.emit).not.toHaveBeenCalled();
    });

    it('should show a toast message when on the favorites page', () => {
      callback({
        action,
        dispatch,
        events,
      });

      jest.runAllTimers();

      expect(events.emit).toHaveBeenCalledTimes(1);
      expect(events.emit).toHaveBeenCalledWith(ToastProvider.ADD, {
        id: 'favorites.removed',
        message: 'favorites.removed',
        action: expect.any(Function),
        actionLabel: 'common.undo',
      });

      const { action: toastAction } = events.emit.mock.calls[0][1];
      toastAction();

      expect(addFavorites).toHaveBeenCalledTimes(1);
      expect(addFavorites).toHaveBeenCalledWith(action.productId, true);

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith(addFavorites());
    });
  });
});
