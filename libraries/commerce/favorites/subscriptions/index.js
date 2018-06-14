import appConfig from '@shopgate/pwa-common/helpers/config';
import {
  shouldFetchFavorites$,
  shouldFetchFreshFavorites$,
  favoritesSyncIdle$,
} from '../streams';
import getFavorites from '../actions/getFavorites';
import { FETCH_FAVORITES_THROTTLE } from '../constants';

/**
 * @param {Function} subscribe Subscribes to an observable.
 */
export default function favorites(subscribe) {
  if (!appConfig.hasFavorites) {
    return;
  }

  subscribe(shouldFetchFavorites$, ({ dispatch }) => {
    dispatch(getFavorites());
  });

  subscribe(shouldFetchFreshFavorites$, ({ dispatch }) => {
    dispatch(getFavorites(true));
  });

  /*
   * Request after 5 seconds since last sync request to make sure
   * backend did actually save it.
   */
  let fetchThrottle;
  subscribe(favoritesSyncIdle$, ({ dispatch }) => {
    clearTimeout(fetchThrottle);
    fetchThrottle = setTimeout(() => {
      dispatch(getFavorites(true));
    }, FETCH_FAVORITES_THROTTLE);
  });
}
