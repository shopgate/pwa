import { ELIMIT } from '@shopgate/pwa-core';
import appConfig from '@shopgate/pwa-common/helpers/config';
import showModal from '@shopgate/pwa-common/actions/modal/showModal';
import { fetchProductsById } from '@shopgate/pwa-common-commerce/product';
import {
  shouldFetchFavorites$,
  shouldFetchFreshFavorites$,
  favoritesSyncIdle$,
  favoritesError$,
  receiveFavorites$,
} from '../streams';
import fetchFavorites from '../actions/fetchFavorites';
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

  /**
   * Fetch missing product data by received favorite Ids
   */
  subscribe(receiveFavorites$, ({ dispatch, action }) => {
    const productIds = action.products.map(product => product.id);
    dispatch(fetchProductsById(productIds));
  });
}
