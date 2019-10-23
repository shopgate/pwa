import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import {
  EFAVORITE,
  EUNKNOWN,
  EBIGAPI,
  ELIMIT,
} from '@shopgate/pwa-core/constants/Pipeline';
import { shouldFetchData, mutable } from '@shopgate/pwa-common/helpers/redux';
import * as pipelines from '../constants/Pipelines';
import {
  receiveFavorites,
  requestFavorites,
  errorFetchFavorites,
} from '../action-creators';

/**
 * Fetch favorites action.
 * @param {boolean} ignoreCache Ignores cache when true
 * @returns {Promise|undefined}
 */
const fetchFavorites = (ignoreCache = false) => (dispatch, getState) => {
  const data = getState().favorites.products;
  if (!ignoreCache && !shouldFetchData(data)) {
    return Promise.resolve();
  }
  const timestamp = Date.now();
  dispatch(requestFavorites());
  const promise = new PipelineRequest(pipelines.SHOPGATE_USER_GET_FAVORITES)
    .setErrorBlacklist([EFAVORITE, EUNKNOWN, EBIGAPI, ELIMIT])
    .dispatch();
  promise
    .then((result) => {
      dispatch(receiveFavorites(result.products, timestamp));
    })
    .catch((err) => {
      logger.error(err);
      dispatch(errorFetchFavorites(err));
    });
  return promise;
};

/** @mixes {MutableFunction} */
export default mutable(fetchFavorites);
