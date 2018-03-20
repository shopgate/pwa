import { getSearchPhrase } from '@shopgate/pwa-common/selectors/history';
import { getCurrentCategoryId } from '../../../category/selectors';

/**
 * Creates the filter params.
 * @param {Object} state The application state.
 * @return {Object}
 */
const buildFilterParams = (state) => {
  const categoryId = getCurrentCategoryId(state);
  const searchPhrase = getSearchPhrase(state);

  return {
    ...categoryId && { categoryId },
    ...searchPhrase && { searchPhrase },
  };
};

export default buildFilterParams;
