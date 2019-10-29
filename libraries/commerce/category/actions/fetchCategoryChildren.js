import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import { shouldFetchData, mutable } from '@shopgate/pwa-common/helpers/redux';
import * as pipelines from '../constants/Pipelines';
import requestCategoryChildren from '../action-creators/requestCategoryChildren';
import receiveCategoryChildren from '../action-creators/receiveCategoryChildren';
import errorCategoryChildren from '../action-creators/errorCategoryChildren';

/**
 * Retrieves category children for a certain category by ID.
 * @param {string} categoryId The ID of the category to request children for.
 * @return {Function} The dispatched action.
 */
const fetchCategoryChildren = categoryId => (dispatch, getState) => {
  const state = getState();
  const category = state.category.childrenByCategoryId[categoryId];

  if (!shouldFetchData(category, 'children')) {
    return;
  }

  dispatch(requestCategoryChildren(categoryId));

  new PipelineRequest(pipelines.SHOPGATE_CATALOG_GET_CATEGORY_CHILDREN)
    .setInput({ categoryId })
    .dispatch()
    .then(result => dispatch(receiveCategoryChildren(categoryId, result.categories)))
    .catch((error) => {
      logger.error(error);
      dispatch(errorCategoryChildren(categoryId));
    });
};

/** @mixes {MutableFunction} */
export default mutable(fetchCategoryChildren);
