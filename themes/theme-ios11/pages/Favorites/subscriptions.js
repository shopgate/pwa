import { ToastProvider } from '@shopgate/engage/core';
import { broadcastLiveMessage } from '@shopgate/engage/a11y';
import { addProductToFavorites, removeProductFromFavorites$, addProductToFavorites$ } from '@shopgate/engage/favorites';
import { FAVORITES_SHOW_TOAST_DELAY } from './constants';

/**
 * @param {Function} subscribe Subscribes to an observable.
 */
export default function favorites(subscribe) {
  subscribe(removeProductFromFavorites$, ({ action, dispatch, events }) => {
    // Animations are too fast. This should wait a little bit.
    setTimeout(() => {
      events.emit(ToastProvider.ADD, {
        id: 'favorites.removed',
        message: 'favorites.removed',
        action: () => dispatch(addProductToFavorites(action.productId)),
        actionLabel: 'common.undo',
      });
    }, FAVORITES_SHOW_TOAST_DELAY);
  });

  subscribe(addProductToFavorites$, () => {
    broadcastLiveMessage('favorites.added');
  });
}
