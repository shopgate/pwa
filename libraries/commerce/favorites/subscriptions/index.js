import difference from 'lodash/difference';
import pipelineDependencies from '@shopgate/pwa-core/classes/PipelineDependencies';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { appDidStart$ } from '@shopgate/pwa-common/streams';
import {
  addOrRemoveFavoritesDebounced$,
  favoritesWillEnter$,
  shouldFetchFreshFavorites$,
  addOrRemoveFavorites$,
} from '../streams';
import { SHOPGATE_USER_ADD_FAVORITES, SHOPGATE_USER_DELETE_FAVORITES } from '../constants/Pipelines';
import fetchFavoriteIds from '../actions/fetchFavoriteIds';
import addFavorites from '../actions/addFavorites';
import removeFavorites from '../actions/removeFavorites';
import { getFavoritesProducts, getProductRelativesOnFavorites } from '../selectors';

/**
 * @param {Function} subscribe Subscribes to an observable.
 */
export default function favorites(subscribe) {
  if (!appConfig.hasFavorites) {
    return;
  }

  /** App start */
  subscribe(appDidStart$, ({ dispatch }) => {
    // Setup sync pipeline dependencies (concurrency to each other and themselves)
    pipelineDependencies.set(SHOPGATE_USER_ADD_FAVORITES, [
      SHOPGATE_USER_ADD_FAVORITES,
      SHOPGATE_USER_DELETE_FAVORITES,
    ]);
    pipelineDependencies.set(SHOPGATE_USER_DELETE_FAVORITES, [
      SHOPGATE_USER_ADD_FAVORITES,
      SHOPGATE_USER_DELETE_FAVORITES,
    ]);

    dispatch(fetchFavoriteIds());
  });

  /** Favorites route enter */
  subscribe(favoritesWillEnter$, ({ dispatch }) => {
    dispatch(fetchFavoriteIds());
  });

  /** User login force fetching fav ids */
  subscribe(shouldFetchFreshFavorites$, ({ dispatch }) => {
    dispatch(fetchFavoriteIds(true));
  });

  /**
   * Build a difference to original favorites and dispatch add/remove actions
   */
  subscribe(
    addOrRemoveFavoritesDebounced$,
    ({ dispatch, getState }) => {
      const { originalIds, ids } = getFavoritesProducts(getState());

      const added = difference(ids, originalIds);
      const removed = difference(originalIds, ids);
      if (added.length) {
        dispatch(addFavorites(added));
      }
      if (removed.length) {
        dispatch(removeFavorites(removed));
      }
    }
  );

  /**
   * Add relatives to added/removes fav and re-dispatch action
   */
  subscribe(addOrRemoveFavorites$, (props) => {
    const { productId, withRelatives } = props.action;
    if (!withRelatives) {
      return;
    }
    const ids = getProductRelativesOnFavorites(props.getState(), { productId });
    if (ids.length) {
      props.dispatch({
        ...props.action,
        productId: ids,
        withRelatives: false,
      });
    }
  });
}
