import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import {
  EFAVORITE,
  EUNKNOWN,
  EBIGAPI,
  ELIMIT,
} from '@shopgate/pwa-core/constants/Pipeline';
import { shouldFetchData, mutable } from '@shopgate/pwa-common/helpers/redux';
import { SHOPGATE_USER_GET_FAVORITES } from '../constants/Pipelines';
import {
  receiveFavorites,
  requestFavorites,
  errorFetchFavorites,
} from '../action-creators';

/**
 * Fetch favorites action.
 * @param {boolean} ignoreCache Ignores cache when true
 * @returns {Function} A redux thunk.
 */
function fetchFavorites(ignoreCache = false) {
  return (dispatch, getState) => {
    const data = getState().favorites.products;

    if (!ignoreCache && !shouldFetchData(data)) {
      return Promise.resolve(null);
    }

    const timestamp = Date.now();
    dispatch(requestFavorites());

    return new PipelineRequest(SHOPGATE_USER_GET_FAVORITES)
      .setErrorBlacklist([EFAVORITE, EUNKNOWN, EBIGAPI, ELIMIT])
      .dispatch()
      .then((result) => {
        dispatch(receiveFavorites(result.products, timestamp));
        return result;
      })
      .catch((err) => {
        logger.error(err);
        dispatch(errorFetchFavorites(err));
        return err;
      });
  };
}

/** @mixes {MutableFunction} */
export default mutable(fetchFavorites);
