import { routeWillEnter$ } from '@shopgate/pwa-common/streams/router';
import { main$ } from '@shopgate/pwa-common/streams/main';
import { appDidStart$ } from '@shopgate/pwa-common/streams/app';
import {
  userDidLogin$,
  userDidLogout$,
} from '@shopgate/pwa-common/streams/user';
import {
  FAVORITES_PATH,
  REQUEST_ADD_FAVORITES,
  REQUEST_REMOVE_FAVORITES,
  RECEIVE_ADD_REMOVE_FAVORITES_SYNC,
  RECEIVE_FAVORITES,
  ERROR_FETCH_FAVORITES,
  ERROR_FAVORITES,
} from '../constants';

/**
 * @link https://developer.shopgate.com/references/engage/streams/favorites
 */

export const favoritesWillEnter$ = routeWillEnter$
  .filter(({ action }) => action.route.pattern === FAVORITES_PATH);

export const favoritesError$ = main$.filter(({ action }) => [
  ERROR_FETCH_FAVORITES,
  ERROR_FAVORITES,
].includes(action.type));

export const shouldFetchFavorites$ = favoritesWillEnter$.merge(appDidStart$);

export const shouldFetchFreshFavorites$ = userDidLogin$.merge(userDidLogout$);

export const favoritesDidUpdate$ = main$.filter(({ action }) => [
  REQUEST_ADD_FAVORITES,
  REQUEST_REMOVE_FAVORITES,
  RECEIVE_FAVORITES,
  ERROR_FETCH_FAVORITES,
  ERROR_FAVORITES,
].includes(action.type));

export const favoritesWillRemoveItem$ = main$
  .filter(({ action }) => action.type === REQUEST_REMOVE_FAVORITES && !action.silent);

export const favoritesSyncIdle$ = main$.filter(({ action }) => (
  action.type === RECEIVE_ADD_REMOVE_FAVORITES_SYNC
));

export const addRemoveFavorites$ = main$.filter(({ action }) => (
  action.type === REQUEST_ADD_FAVORITES || action.type === REQUEST_REMOVE_FAVORITES
));

export const clearAddRemoveFavoritesBuffer$ = addRemoveFavorites$.debounceTime(2000).delay(2000);

export const addRemoveBufferedFavorites$ = addRemoveFavorites$
  .buffer(clearAddRemoveFavoritesBuffer$);

