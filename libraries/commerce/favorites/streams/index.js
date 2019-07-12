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
  RECEIVE_FAVORITES,
  RECEIVE_SYNC_FAVORITES,
  ERROR_SYNC_FAVORITES,
  ERROR_FETCH_FAVORITES,
  IDLE_SYNC_FAVORITES,
  ERROR_FAVORITES,
} from '../constants';

/**
 * @link https://developer.shopgate.com/references/engage/streams/favorites
 */

/** @type {Observable} */
export const favoritesWillEnter$ = routeWillEnter$
  .filter(({ action }) => action.route.pattern === FAVORITES_PATH);

/** @type {Observable} */
export const favoritesError$ = main$.filter(({ action }) => [
  ERROR_SYNC_FAVORITES,
  ERROR_FETCH_FAVORITES,
  ERROR_FAVORITES,
].includes(action.type));

/** @type {Observable} */
export const shouldFetchFavorites$ = favoritesWillEnter$.merge(appDidStart$);

/** @type {Observable} */
export const shouldFetchFreshFavorites$ = userDidLogin$.merge(userDidLogout$);

/** @type {Observable} */
export const favoritesDidUpdate$ = main$.filter(({ action }) => [
  REQUEST_ADD_FAVORITES,
  REQUEST_REMOVE_FAVORITES,
  RECEIVE_FAVORITES,
  RECEIVE_SYNC_FAVORITES,
  ERROR_SYNC_FAVORITES,
  ERROR_FETCH_FAVORITES,
].includes(action.type));

/** @type {Observable} */
export const favoritesWillRemoveItem$ = main$
  .filter(({ action }) => action.type === REQUEST_REMOVE_FAVORITES && !action.silent);

/** @type {Observable} */
export const receiveFavorites$ = main$.filter(({ action }) => action.type === RECEIVE_FAVORITES);

/** @type {Observable} */
export const favoritesSyncIdle$ = main$.filter(({ action }) => action.type === IDLE_SYNC_FAVORITES);
