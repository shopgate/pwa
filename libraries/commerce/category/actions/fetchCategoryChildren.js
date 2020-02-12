import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { shouldFetchData, mutable } from '@shopgate/pwa-common/helpers/redux';
import { SHOPGATE_CATALOG_GET_CATEGORY_CHILDREN } from '../constants/Pipelines';
import requestCategoryChildren from '../action-creators/requestCategoryChildren';
import receiveCategoryChildren from '../action-creators/receiveCategoryChildren';
import errorCategoryChildren from '../action-creators/errorCategoryChildren';

/**
 * Retrieves category children for a certain category by ID.
 * @param {string} categoryId The ID of the category to request children for.
 * @return {Function} The dispatched action.
 */
function fetchCategoryChildren(categoryId) {
  return (dispatch, getState) => {
    const category = getState().category.childrenByCategoryId[categoryId];

    if (!shouldFetchData(category, 'children')) {
      return Promise.resolve(null);
    }

    dispatch(requestCategoryChildren(categoryId));

    const request = new PipelineRequest(SHOPGATE_CATALOG_GET_CATEGORY_CHILDREN)
      .setInput({ categoryId })
      .dispatch();

    request
      .then((result) => {
        dispatch(receiveCategoryChildren(categoryId, result.categories));
      })
      .catch(() => {
        dispatch(errorCategoryChildren(categoryId));
      });

    return request;
  };
}

/** @mixes {MutableFunction} */
export default mutable(fetchCategoryChildren);
