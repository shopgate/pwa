import { ELIMIT } from '@shopgate/pwa-core';
import appConfig from '@shopgate/pwa-common/helpers/config';
import showModal from '@shopgate/pwa-common/actions/modal/showModal';
import { appDidStart$ } from '@shopgate/pwa-common/streams';
import { fetchProductsById } from '@shopgate/pwa-common-commerce/product';
import {
  shouldFetchFreshFavorites$,
  favoritesWillEnter$,
  favoritesSyncIdle$,
  favoritesError$,
} from '../streams';
import fetchFavorites from '../actions/fetchFavorites';
import { requestRemoveFavorites } from '../action-creators';
import { FETCH_FAVORITES_THROTTLE } from '../constants';
import { getFavoritesProductsIds } from '../selectors';

/**
 * @param {Function} subscribe Subscribes to an observable.
 */
export default function favorites(subscribe) {
  if (!appConfig.hasFavorites) {
    return;
  }

  /** App start */
  subscribe(appDidStart$, ({ dispatch }) => {
    dispatch(fetchFavorites());
  });

  /** Favorites route enter */
  subscribe(favoritesWillEnter$, ({ dispatch, getState }) => {
    dispatch(fetchFavorites()).then(() => {
      const productIds = getFavoritesProductsIds(getState());
      dispatch(fetchProductsById(productIds, null, false));
    });
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
}
