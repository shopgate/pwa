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

/**
 * Gets triggered when the favorites page is about to be entered.
 * @type {Observable}
 */
export const favoritesWillEnter$ = routeWillEnter$
  .filter(({ action }) => action.route.pattern === FAVORITES_PATH);

/**
 * Gets triggered when the debounce time of `addProductToFavorites` passes.
 * @type {Observable}
 */
export const addProductToFavoritesDebounced$ = main$
  .filter(({ action }) => action.type === ADD_PRODUCT_TO_FAVORITES)
  .debounceTime(FAVORITE_BUTTON_DEBOUNCE_TIME);

/**
 * Gets triggered when the debounce time of `removeProductFromFavorites` passes.
 * @type {Observable}
 */
export const removeProductFromFavoritesDebounced$ = main$
  .filter(({ action }) => action.type === REMOVE_PRODUCT_FROM_FAVORITES)
  .debounceTime(FAVORITE_BUTTON_DEBOUNCE_TIME);

/**
 * Gets triggered when any errors related to the favorite list occur.
 * @type {Observable}
 */
export const favoritesError$ = main$.filter(({ action }) => [
  ERROR_FETCH_FAVORITES,
  ERROR_ADD_FAVORITES,
  ERROR_REMOVE_FAVORITES,
  ERROR_FAVORITES, // local favorite errors, unrelated to network requests
].includes(action.type));

/**
 * Gets triggered when errors occur, that are only related to the frontend part of the
 * favorite list.
 * @type {Observable}
 */
export const errorFavoritesLimit$ = favoritesError$
  .filter(({ action }) => (
    action.type === ERROR_FAVORITES && action.error && action.error.code === FAVORITES_LIMIT_ERROR
  ));

/**
 * Gets triggered when the app started or when the favorites page is about to be entered.
 * @type {Observable}
 */
export const shouldFetchFavorites$ = favoritesWillEnter$.merge(appDidStart$);

/**
 * Gets triggered when the favorite list should be refreshed (without
 * @type {Observable}
 */
export const shouldFetchFreshFavorites$ = userDidLogin$.merge(userDidLogout$);

/**
 * Gets triggered when the favorites updated in any way.
 * @type {Observable}
 */
export const favoritesDidUpdate$ = main$.filter(({ action }) => [
  REQUEST_ADD_FAVORITES,
  ERROR_ADD_FAVORITES,
  REQUEST_REMOVE_FAVORITES,
  ERROR_REMOVE_FAVORITES,
  RECEIVE_FAVORITES,
  ERROR_FETCH_FAVORITES,
].includes(action.type));

/**
 * Gets triggered when an "add to favorites" action is being placed into the favorite list buffer.
 * @type {Observable}
 */
export const favoritesWillAddItem$ = main$
  .filter(({ action }) => action.type === REQUEST_ADD_FAVORITES);

/**
 * Gets triggered when a single product has been successfully added to the favorite list.
 * @type {Observable}
 */
export const favoritesDidAddItem$ = main$
  .filter(({ action }) => action.type === SUCCESS_ADD_FAVORITES);

/**
 * Gets triggered when a "remove from favorites" action is being placed into the favorite
 * list buffer.
 * @type {Observable}
 */
export const favoritesWillRemoveItem$ = main$
  .filter(({ action }) => action.type === REQUEST_REMOVE_FAVORITES);

/**
 * Gets triggered when a single product has been successfully removed from the favorite list.
 * @type {Observable}
 */
export const favoritesDidRemoveItem$ = main$
  .filter(({ action }) => action.type === SUCCESS_REMOVE_FAVORITES);

/**
 * Gets triggered when the favorite list has successfully been received from the backend.
 * @type {Observable}
 */
export const receiveFavorites$ = main$.filter(({ action }) => action.type === RECEIVE_FAVORITES);

/**
 * Gets triggered whenever all favorite changes have been successfully processed or once when
 * any of the buffered change requests fails.
 * @type {Observable}
 */
export const favoritesSyncIdle$ = main$
  .filter(({ action }) => action.type === IDLE_SYNC_FAVORITES);

/**
 * Gets triggered when the favorites should be refreshed to maintain data consistency.
 * @type {Observable}
 */
export const refreshFavorites$ = favoritesSyncIdle$.debounceTime(FETCH_FAVORITES_THROTTLE);

/**
 * Gets triggered when a product is requested to be added to or removed from the favorite list.
 * @type {Observable}
 */
export const didRequestAddOrRemoveFavorites$ = main$.filter(({ action }) => (
  action.type === REQUEST_ADD_FAVORITES || action.type === REQUEST_REMOVE_FAVORITES
));

/**
 * Gets triggered when the favorites action buffer should be flushed immediately.
 * @type {Observable}
 */
export const didRequestFlushFavoritesBuffer$ = main$
  .filter(({ action }) => action.type === REQUEST_FLUSH_FAVORITES_BUFFER);

/**
 * Gets triggered when the favorites buffer is supposed to be flushed after some delay time or
 * when the `requestFlushFavoritesBuffer` action was triggered.
 * @type {Observable}
 */
export const didReceiveFlushFavoritesBuffer$ = didRequestAddOrRemoveFavorites$
  .buffer(didRequestAddOrRemoveFavorites$
    .debounceTime(FAVORITE_ACTION_BUFFER_TIME) // Compress delayed actions into a single one
    .merge(didRequestFlushFavoritesBuffer$));
