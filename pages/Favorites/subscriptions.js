import setTitle from '@shopgate/pwa-common/actions/view/setTitle';
import { FAVORITES_PATH } from '@shopgate/pwa-common-commerce/favorites/constants';
import { addFavorites } from '@shopgate/pwa-common-commerce/favorites/actions/toggleFavorites';
import { favoritesWillEnter$, favoritesWillRemoveItem$ } from '@shopgate/pwa-common-commerce/favorites/streams';
import getCurrentRoute from '@virtuous/conductor-helpers/getCurrentRoute';
import ToastProvider from '@shopgate/pwa-common/providers/toast';
import { FAVORITES_SHOW_TOAST_DELAY } from './constants';

/**
 * @param {Function} subscribe Subscribes to an observable.
 */
export default function favorites(subscribe) {
  subscribe(favoritesWillEnter$, ({ dispatch }) => {
    dispatch(setTitle('titles.favorites'));
  });

  subscribe(favoritesWillRemoveItem$, ({ action, dispatch, events }) => {
    if (getCurrentRoute().pattern !== FAVORITES_PATH) {
      return;
    }

    // Animations are too fast. This should wait a little bit.
    setTimeout(() => {
      events.emit(ToastProvider.ADD, {
        id: 'favorites.removed',
        message: 'favorites.removed',
        action: () => dispatch(addFavorites(action.productId, true)),
        actionLabel: 'common.undo',
      });
    }, FAVORITES_SHOW_TOAST_DELAY);
  });
}
