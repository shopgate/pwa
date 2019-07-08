import { ELIMIT } from '@shopgate/pwa-core';
import appConfig from '@shopgate/pwa-common/helpers/config';
import showModal from '@shopgate/pwa-common/actions/modal/showModal';
import {
  shouldFetchFavorites$,
  shouldFetchFreshFavorites$,
  favoritesSyncIdle$,
  favoritesError$,
  addRemoveBufferedFavorites$,
} from '../streams';
import fetchFavorites from '../actions/fetchFavorites';
import { dispatchBufferedFavoriteActions } from '../actions/toggleFavorites';
import { requestRemoveFavorites } from '../action-creators';
import { FETCH_FAVORITES_THROTTLE } from '../constants';

/**
 * @param {Function} subscribe Subscribes to an observable.
 */
export default function favorites(subscribe) {
  if (!appConfig.hasFavorites) {
    return;
  }

  /** App start / favorites route enter */
  subscribe(shouldFetchFavorites$, ({ dispatch }) => {
    dispatch(fetchFavorites());
  });

  /** User login / logout */
  subscribe(shouldFetchFreshFavorites$, ({ dispatch }) => {
    dispatch(fetchFavorites(true));
  });

  /**
   * Request after N seconds since last sync request to make sure
   * backend did actually save it
   */
  const refreshFavorites$ = favoritesSyncIdle$.debounceTime(FETCH_FAVORITES_THROTTLE);
  subscribe(refreshFavorites$, ({ dispatch }) => {
    dispatch(fetchFavorites(true));
  });

  const errorQuotaFavorites$ = favoritesError$.filter(({ action }) => (
    action.error && action.error.code === ELIMIT
  ));
  subscribe(errorQuotaFavorites$, ({ dispatch, action }) => {
    dispatch(showModal({
      confirm: null,
      dismiss: 'modal.ok',
      title: 'modal.title_error',
      message: 'favorites.error_limit',
    })).then(() => {
      if (action.productId) {
        dispatch(requestRemoveFavorites(action.productId, true));
      }
    });
  });

  subscribe(addRemoveBufferedFavorites$, (bufferedParams) => {
    if (!(Array.isArray(bufferedParams) && bufferedParams.length > 0)) {
      return;
    }

    const paramWithDispatch = bufferedParams.find(param => (
      typeof param === 'object' && param.hasOwnProperty('dispatch')
    ));

    if (!paramWithDispatch) {
      return;
    }
    const { dispatch } = paramWithDispatch;
    const bufferedActions = bufferedParams
      .filter(param => (
        typeof param === 'object' && param.hasOwnProperty('action')
      ))
      .map(param => param.action);

    dispatch(dispatchBufferedFavoriteActions(bufferedActions));
  });
}
