import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import { shouldFetchData, mutable } from '@shopgate/pwa-common/helpers/redux';
import { SHOPGATE_CATALOG_GET_CATEGORY_CHILDREN } from '../constants/Pipelines';
import requestCategoryChildren from '../action-creators/requestCategoryChildren';
import receiveCategoryChildren from '../action-creators/receiveCategoryChildren';
import errorCategoryChildren from '../action-creators/errorCategoryChildren';
import { getChildCategoriesById } from '../selectors';

/**
 * Retrieves category children for a certain category by ID.
 * @param {string} categoryId The ID of the category to request children for.
 * @return {Function} The dispatched action.
 */
function fetchCategoryChildren(categoryId) {
  return (dispatch, getState) => {
    const category = getChildCategoriesById(getState(), { categoryId });

    if (!shouldFetchData(category, 'children')) {
      return Promise.resolve(null);
    }

    dispatch(requestCategoryChildren(categoryId));

    return new PipelineRequest(SHOPGATE_CATALOG_GET_CATEGORY_CHILDREN)
      .setInput({ categoryId })
      .dispatch()
      .then((result) => {
        dispatch(receiveCategoryChildren(categoryId, result.categories));
        return result;
      })
      .catch((error) => {
        logger.error(error);
        dispatch(errorCategoryChildren(categoryId));
        return error;
      });
  };
}

/** @mixes {MutableFunction} */
export default mutable(fetchCategoryChildren);
