import { getCurrentRoute } from '@shopgate/pwa-common/selectors/router';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';

/**
 * Creates the filter params.
 * @param {Object} state The application state.
 * @return {Object}
 */
const buildFilterParams = (state) => {
  const { params, query } = getCurrentRoute(state);

  return {
    ...params.categoryId && { categoryId: hex2bin(params.categoryId) },
    ...query.s && { searchPhrase: query.s },
  };
};

export default buildFilterParams;
