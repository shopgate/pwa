import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import { shouldFetchData, mutable } from '@shopgate/pwa-common/helpers/redux';
import { SHOPGATE_CATALOG_GET_ROOT_CATEGORIES } from '../constants/Pipelines';
import requestRootCategories from '../action-creators/requestRootCategories';
import receiveRootCategories from '../action-creators/receiveRootCategories';
import errorRootCategories from '../action-creators/errorRootCategories';

/**
 * Retrieves the root categories from store.
 * @return {Function} The dispatched action.
 */
function fetchRootCategories() {
  return (dispatch, getState) => {
    const state = getState();
    const { rootCategories } = state.category;

    if (!shouldFetchData(rootCategories, 'categories')) {
      return Promise.resolve(null);
    }

    dispatch(requestRootCategories());

    return new PipelineRequest(SHOPGATE_CATALOG_GET_ROOT_CATEGORIES)
      .dispatch()
      .then((result) => {
        dispatch(receiveRootCategories(result.categories));
        return result;
      })
      .catch((error) => {
        logger.error(error);
        dispatch(errorRootCategories());
        return error;
      });
  };
}

/** @mixes {MutableFunction} */
export default mutable(fetchRootCategories);
