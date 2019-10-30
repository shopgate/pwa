import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import { ERROR_HANDLE_SUPPRESS } from '@shopgate/pwa-core/constants/ErrorHandleTypes';
import { shouldFetchData, mutable } from '@shopgate/pwa-common/helpers/redux';
import { SHOPGATE_CATALOG_GET_CATEGORY } from '../constants/Pipelines';
import fetchCategoryChildren from './fetchCategoryChildren';
import requestCategory from '../action-creators/requestCategory';
import receiveCategory from '../action-creators/receiveCategory';
import errorCategory from '../action-creators/errorCategory';
import { getCategoryById } from '../selectors';

/**
 * Fetches the data for a given category ID (including child categories).
 * @param {string} categoryId The category ID.
 * @return {Function} The dispatched action.
 */
function fetchCategory(categoryId) {
  return (dispatch, getState) => {
    const category = getCategoryById(getState(), { categoryId });

    if (!shouldFetchData(category)) {
      /**
       * Child categories are maybe missing.
       * So we need to check it (check happens inside fetchCategoryChildren).
       * This is the case if we got categories from getRootCategory
      */
      if (category.childrenCount) {
        dispatch(fetchCategoryChildren(categoryId));
      }

      return Promise.resolve(category);
    }

    // No data at all. So we have the fetch the category with children included
    dispatch(requestCategory(categoryId));

    return new PipelineRequest(SHOPGATE_CATALOG_GET_CATEGORY)
      .setInput({
        categoryId,
        includeChildren: true,
      })
      .setHandleErrors(ERROR_HANDLE_SUPPRESS)
      .dispatch()
      .then((result) => {
        dispatch(receiveCategory(categoryId, result, (result.children || [])));
        return result;
      })
      .catch((error) => {
        logger.error(error);
        dispatch(errorCategory(categoryId, error.code));
        return error;
      });
  };
}

/** @mixes {MutableFunction} */
export default mutable(fetchCategory);
