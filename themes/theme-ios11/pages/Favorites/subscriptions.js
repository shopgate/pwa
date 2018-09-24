import { FAVORITES_PATH } from '@shopgate/pwa-common-commerce/favorites/constants';
import { addFavorites } from '@shopgate/pwa-common-commerce/favorites/actions/toggleFavorites';
import { hasFavorites } from '@shopgate/pwa-common-commerce/favorites/selectors';
import {
  favoritesWillRemoveItem$,
  favoritesDidUpdate$,
} from '@shopgate/pwa-common-commerce/favorites/streams';
import { getHistoryPathname } from '@shopgate/pwa-common/selectors/history';
import createToast from '@shopgate/pwa-common/actions/toast/createToast';
import dismissToasts from '@shopgate/pwa-common/action-creators/toast/dismissToasts';
import {
  routeDidEnter,
  routeDidLeave,
} from '@shopgate/pwa-common/streams/history';
import {
  showTabBar,
  hideTabBar,
} from 'Components/TabBar/actions';
import { FAVORITES_SHOW_TOAST_DELAY } from './constants';

/**
 * Favorites page subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function favorites(subscribe) {
  subscribe(favoritesWillRemoveItem$, ({ dispatch, action, getState }) => {
    if (getHistoryPathname(getState()) !== FAVORITES_PATH) {
      // No toast message when favorites is not active page.
      return;
    }
    // Animations are too fast. This should wait a little bit.
    setTimeout(() => {
      dispatch(createToast({
        action: 'common.undo',
        actionOnClick: addFavorites(action.productId),
        message: 'favorites.removed',
        replaceable: true,
        duration: 2500,
      }));
    }, FAVORITES_SHOW_TOAST_DELAY);
  });

  subscribe(favoritesDidUpdate$, ({ dispatch, getState }) => {
    const state = getState();
    if (getHistoryPathname(state) === FAVORITES_PATH) {
      // Update the tabbar visibility state when the list changes while the user is on the list.
      if (hasFavorites(state)) {
        dispatch(showTabBar());
      } else {
        dispatch(hideTabBar());
      }
    }
  });

  subscribe(routeDidEnter(FAVORITES_PATH), ({ dispatch, getState }) => {
    // When the favorites route is active and no products are on the list, the tabbar is hidden.
    if (hasFavorites(getState())) {
      dispatch(showTabBar());
    } else {
      dispatch(hideTabBar());
    }
  });

  subscribe(routeDidLeave(FAVORITES_PATH), ({ dispatch }) => {
    dispatch(dismissToasts());
    // Re establish the tabbar visibility.
    dispatch(showTabBar(true));
  });
}

