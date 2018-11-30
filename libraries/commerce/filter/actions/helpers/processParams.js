import processFilters from './processFilters';
import buildRequestFilters from './buildRequestFilters';

/**
 * Process the pipeline params to be compatible with the current API specifications.
 * Currently the categoryId field cannot be used in combination with the filter field. In order to
 * use them together the categoryId field has to be extracted into the filter field.
 * TODO: Remove this function once the pipeline specifications have been adjusted.
 * @param {Object} params The request params.
 * @param {Object} [filters=null] The current active filters.
 * @returns {Object} A set of compatible params.
 */
const processParams = (params, filters = null) => {
  const processedFilters = processFilters(buildRequestFilters(filters));

  let newParams = {
    ...params,
    ...(processedFilters && Object.keys(processedFilters).length) && { filters: processedFilters },
  };

  if (params.categoryId && processedFilters && Object.keys(processedFilters).length) {
    newParams = {
      ...params,
      filters: {
        categoryId: params.categoryId,
        ...processedFilters,
      },
    };
    delete newParams.categoryId;
  }

  return newParams;
};

export default processParams;
