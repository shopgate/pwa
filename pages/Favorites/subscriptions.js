import setTitle from '@shopgate/pwa-common/actions/view/setTitle';
import { FAVORITES_PATH } from '@shopgate/pwa-common-commerce/favorites/constants';
import { addFavorites } from '@shopgate/pwa-common-commerce/favorites/actions/toggleFavorites';
import { favoritesWillEnter$, favoritesWillRemoveItem$ } from '@shopgate/pwa-common-commerce/favorites/streams';
import { getCurrentRoute } from '@shopgate/pwa-common/selectors/router';
import createToast from '@shopgate/pwa-common/actions/toast/createToast';
import { FAVORITES_SHOW_TOAST_DELAY } from './constants';

/**
 * @param {Function} subscribe Subscribes to an observable.
 */
export default function favorites(subscribe) {
  subscribe(favoritesWillEnter$, ({ dispatch }) => {
    dispatch(setTitle('titles.favorites'));
  });

  subscribe(favoritesWillRemoveItem$, ({ dispatch, action, getState }) => {
    if (getCurrentRoute(getState()).pattern !== FAVORITES_PATH) {
      return;
    }

    // Animations are too fast. This should wait a little bit.
    setTimeout(() => {
      dispatch(createToast({
        action: 'common.undo',
        actionOnClick: addFavorites(action.productId, true),
        duration: 2500,
        message: 'favorites.removed',
        replaceable: true,
      }));
    }, FAVORITES_SHOW_TOAST_DELAY);
  });
}
