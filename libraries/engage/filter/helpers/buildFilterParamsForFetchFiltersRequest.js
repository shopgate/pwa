import isPlainObject from 'lodash/isPlainObject';

/**
 * Creates the filter params to be used with a fetchFilters request.
 * @param {Object} filters All configured filters
 * @return {Object}
 */
const buildFilterParamsForFetchFiltersRequest = (filters = {}) => {
  if (!isPlainObject(filters)) {
    return null;
  }

  const sanitizedFilters = Object.keys(filters).reduce((acc, filterId) => {
    const filter = filters[filterId];

    if (filter?.useForFetchFilters) {
      // flag is set on filter level - remove flag and add to the result object
      const { useForFetchFilters, ...sanitizedFilter } = filter;
      acc[filterId] = sanitizedFilter;
    } else if (Array.isArray(filter.value)) {
      // check for flags on value level
      const sanitizedFilter = {
        ...filter,
        value: filter.value.reduce((valueAcc, currentValue) => {
          const { useForFetchFilters, ...sanitizedValue } = currentValue;
          if (currentValue?.useForFetchFilters) {
            // flag is set on value level - consider value for the results object
            valueAcc.push(sanitizedValue);
          }

          return valueAcc;
        }, []),
      };

      if (sanitizedFilter.value.length) {
        // only add the filter when it has values that are supposed to be used for a filter request
        acc[filterId] = sanitizedFilter;
      }
    }

    return acc;
  }, {});

  return Object.keys(sanitizedFilters).length ? sanitizedFilters : null;
};

export default buildFilterParamsForFetchFiltersRequest;
