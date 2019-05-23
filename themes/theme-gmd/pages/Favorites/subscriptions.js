import { addFavorites } from '@shopgate/pwa-common-commerce/favorites/actions/toggleFavorites';
import { favoritesWillRemoveItem$ } from '@shopgate/pwa-common-commerce/favorites/streams';
import { ToastProvider } from '@shopgate/engage/core';
import { FAVORITES_SHOW_TOAST_DELAY } from './constants';

/**
 * @param {Function} subscribe Subscribes to an observable.
 */
export default function favorites(subscribe) {
  subscribe(favoritesWillRemoveItem$, ({ action, dispatch, events }) => {
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
