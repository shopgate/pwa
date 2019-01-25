import appConfig from '@shopgate/pwa-common/helpers/config';
import {
  shouldFetchFavorites$,
  shouldFetchFreshFavorites$,
  favoritesSyncIdle$,
} from '../streams';
import fetchFavorites from '../actions/fetchFavorites';
import { FETCH_FAVORITES_THROTTLE } from '../constants';

/**
 * @param {Function} subscribe Subscribes to an observable.
 */
export default function favorites(subscribe) {
  if (!appConfig.hasFavorites) {
    return;
  }

  subscribe(shouldFetchFavorites$, ({ dispatch }) => {
    dispatch(fetchFavorites());
  });

  subscribe(shouldFetchFreshFavorites$, ({ dispatch }) => {
    dispatch(fetchFavorites(true));
  });

  /*
   * Request after 5 seconds since last sync request to make sure
   * backend did actually save it.
   */
  let fetchThrottle;
  subscribe(favoritesSyncIdle$, ({ dispatch }) => {
    clearTimeout(fetchThrottle);
    fetchThrottle = setTimeout(() => {
      dispatch(fetchFavorites(true));
    }, FETCH_FAVORITES_THROTTLE);
  });
}
