import { routeWillEnter$ } from '@shopgate/pwa-common/streams/router';
import { main$ } from '@shopgate/pwa-common/streams/main';
import { appDidStart$ } from '@shopgate/pwa-common/streams/app';
import {
  userDidLogin$,
  userDidLogout$,
} from '@shopgate/pwa-common/streams/user';
import {
  FAVORITES_PATH,
  ADD_PRODUCT_TO_FAVORITES,
  REMOVE_PRODUCT_FROM_FAVORITES,
  RECEIVE_FAVORITES,
  ERROR_FAVORITES,
  ERROR_FETCH_FAVORITES,
  REQUEST_ADD_FAVORITES,
  SUCCESS_ADD_FAVORITES,
  ERROR_ADD_FAVORITES,
  REQUEST_REMOVE_FAVORITES,
  SUCCESS_REMOVE_FAVORITES,
  ERROR_REMOVE_FAVORITES,
  IDLE_SYNC_FAVORITES,
  REQUEST_FLUSH_FAVORITES_BUFFER,
  FAVORITES_LIMIT_ERROR,
  FETCH_FAVORITES_THROTTLE,
  FAVORITE_ACTION_BUFFER_TIME,
  FAVORITE_BUTTON_DEBOUNCE_TIME,
} from '../constants';

/**
 * @link https://developer.shopgate.com/references/engage/streams/favorites
 */

/** @type {Observable} */
export const favoritesWillEnter$ = routeWillEnter$
  .filter(({ action }) => action.route.pattern === FAVORITES_PATH);

/**
 * Debounce addProductToFavorites action
 * @type {Observable}
 */
export const addProductToFavoritesDebounced$ = main$
  .filter(({ action }) => action.type === ADD_PRODUCT_TO_FAVORITES)
  .debounceTime(FAVORITE_BUTTON_DEBOUNCE_TIME);

/**
 * Debounce removeProductFromFavorites action
 * @type {Observable}
 */
export const removeProductFromFavoritesDebounced$ = main$
  .filter(({ action }) => action.type === REMOVE_PRODUCT_FROM_FAVORITES)
  .debounceTime(FAVORITE_BUTTON_DEBOUNCE_TIME);

/** @type {Observable} */
export const favoritesError$ = main$.filter(({ action }) => [
  ERROR_FETCH_FAVORITES,
  ERROR_ADD_FAVORITES,
  ERROR_REMOVE_FAVORITES,
  ERROR_FAVORITES, // local favorite errors, unrelated to network requests
].includes(action.type));

/** @type {Observable} */
export const errorFavoritesLimit$ = favoritesError$
  .filter(({ action }) => (
    action.type === ERROR_FAVORITES && action.error && action.error.code === FAVORITES_LIMIT_ERROR
  ));

/** @type {Observable} */
export const shouldFetchFavorites$ = favoritesWillEnter$.merge(appDidStart$);

/** @type {Observable} */
export const shouldFetchFreshFavorites$ = userDidLogin$.merge(userDidLogout$);

/** @type {Observable} */
export const favoritesDidUpdate$ = main$.filter(({ action }) => [
  REQUEST_ADD_FAVORITES,
  ERROR_ADD_FAVORITES,
  REQUEST_REMOVE_FAVORITES,
  ERROR_REMOVE_FAVORITES,
  RECEIVE_FAVORITES,
  ERROR_FETCH_FAVORITES,
].includes(action.type));

/** @type {Observable} */
export const favoritesWillAddItem$ = main$
  .filter(({ action }) => action.type === REQUEST_ADD_FAVORITES);

/** @type {Observable} */
export const favoritesDidAddItem$ = main$
  .filter(({ action }) => action.type === SUCCESS_ADD_FAVORITES);

/** @type {Observable} */
export const favoritesWillRemoveItem$ = main$
  .filter(({ action }) => action.type === REQUEST_REMOVE_FAVORITES);

/** @type {Observable} */
export const favoritesDidRemoveItem$ = main$
  .filter(({ action }) => action.type === SUCCESS_REMOVE_FAVORITES);

/** @type {Observable} */
export const receiveFavorites$ = main$.filter(({ action }) => action.type === RECEIVE_FAVORITES);

/** @type {Observable} */
export const favoritesSyncIdle$ = main$
  .filter(({ action }) => action.type === IDLE_SYNC_FAVORITES);

/** @type {Observable} */
export const refreshFavorites$ = favoritesSyncIdle$.debounceTime(FETCH_FAVORITES_THROTTLE);

/**
 * Combines debounced add or remove requests to handle them in the same way
 * @type {Observable}
 */
export const didRequestAddOrRemoveFavorites$ = main$.filter(({ action }) => (
  action.type === REQUEST_ADD_FAVORITES || action.type === REQUEST_REMOVE_FAVORITES
));

/** @type {Observable} */
export const didRequestFlushFavoritesBuffer$ = main$
  .filter(({ action }) => action.type === REQUEST_FLUSH_FAVORITES_BUFFER);

/**
 * This stream delivers events to flush the favorites buffer after some delay time or immediately
 * by triggering the `requestFlushFavoritesBuffer` action.
 * @type {Observable}
 */
export const didReceiveFlushFavoritesBuffer$ = didRequestAddOrRemoveFavorites$
  .buffer(didRequestAddOrRemoveFavorites$
    .debounceTime(FAVORITE_ACTION_BUFFER_TIME) // Compress delayed actions into a single one
    .merge(didRequestFlushFavoritesBuffer$));
