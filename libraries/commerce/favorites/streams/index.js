import 'rxjs/add/operator/distinctUntilChanged';
import { routeDidEnter } from '@shopgate/pwa-common/streams/history';
import { main$ } from '@shopgate/pwa-common/streams/main';
import {
  FAVORITES_PATH,
  REQUEST_ADD_FAVORITES,
  REQUEST_REMOVE_FAVORITES,
  RECEIVE_FAVORITES,
  RECEIVE_SYNC_FAVORITES,
  ERROR_SYNC_FAVORITES,
  ERROR_FETCH_FAVORITES,
  IDLE_SYNC_FAVORITES,
} from '../constants';

export const favoritesDidEnter$ = routeDidEnter(FAVORITES_PATH);

export const favoritesDidUpdate$ = main$.filter(({ action }) => [
  REQUEST_ADD_FAVORITES,
  REQUEST_REMOVE_FAVORITES,
  RECEIVE_FAVORITES,
  RECEIVE_SYNC_FAVORITES,
  ERROR_SYNC_FAVORITES,
  ERROR_FETCH_FAVORITES,
].includes(action.type));

export const favoritesError$ = main$.filter(({ action }) => [
  ERROR_SYNC_FAVORITES,
  ERROR_FETCH_FAVORITES,
].includes(action.type));

export const favoritesWillRemoveItem$ = main$
  .filter(({ action }) => action.type === REQUEST_REMOVE_FAVORITES);

export const favoritesSyncIdle$ = main$.filter(({ action }) => action.type === IDLE_SYNC_FAVORITES);
