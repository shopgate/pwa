import { getCurrentRoute } from '@shopgate/pwa-common/selectors/router';
import {
  CATEGORY_ALL_PATTERN,
  CATEGORY_ALL_FILTER_PATTERN,
} from '@shopgate/pwa-common-commerce/category/constants';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import buildRequestFilters from './buildRequestFilters';

/**
 * Creates the filter params.
 * @param {Object} state The application state.
 * @param {Object} [filters] Optional filters to be sent with the request
 * @return {Object}
 */
const buildFilterParams = (state, filters) => {
  const {
    params, query, pattern,
  } = getCurrentRoute(state);

  let filterParams = {
    ...params.categoryId && { categoryId: hex2bin(params.categoryId) },
    ...query.s && { searchPhrase: query.s },
  };

  if ([CATEGORY_ALL_PATTERN, CATEGORY_ALL_FILTER_PATTERN].includes(pattern)) {
    filterParams = {
      searchPhrase: '*',
    };
  }

  return {
    ...filterParams,
    ...filters ? { filters: buildRequestFilters(filters) } : null,
  };
};

export default buildFilterParams;
