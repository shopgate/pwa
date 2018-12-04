import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import { getCurrentRoute } from '@shopgate/pwa-common/helpers/router';

/**
 * Creates the filter params.
 * @param {Object} state The application state.
 * @return {Object}
 */
const buildFilterParams = () => {
  const { params, query } = getCurrentRoute();

  return {
    ...params.categoryId && { categoryId: hex2bin(params.categoryId) },
    ...query.s && { searchPhrase: query.s },
  };
};

export default buildFilterParams;
