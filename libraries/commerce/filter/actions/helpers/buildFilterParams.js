import { getCurrentRoute } from '@shopgate/pwa-common/selectors/router';
import {
  CATEGORY_ALL_PATTERN,
  CATEGORY_ALL_FILTER_PATTERN,
} from '@shopgate/pwa-common-commerce/category/constants';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';

/**
 * Creates the filter params.
 * @param {Object} state The application state.
 * @return {Object}
 */
const buildFilterParams = (state) => {
  const {
    params, query, pattern,
  } = getCurrentRoute(state);

  if ([CATEGORY_ALL_PATTERN, CATEGORY_ALL_FILTER_PATTERN].includes(pattern)) {
    return {
      searchPhrase: '*',
    };
  }

  return {
    ...params.categoryId && { categoryId: hex2bin(params.categoryId) },
    ...query.s && { searchPhrase: query.s },
  };
};

export default buildFilterParams;
