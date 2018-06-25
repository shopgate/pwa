import getCurrentRoute from '@virtuous/conductor-helpers/getCurrentRoute';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';

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
