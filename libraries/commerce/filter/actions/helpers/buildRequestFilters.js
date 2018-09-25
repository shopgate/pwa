import {
  FILTER_TYPE_SINGLE_SELECT,
  FILTER_TYPE_MULTISELECT,
  FILTER_TYPE_RANGE,
} from '@shopgate/pwa-common-commerce/filter/constants';

/**
 * Converts an active filters object from the current route state
 * to one that can be used within a pipeline request.
 * @param {Object} activeFilters The selected filters.
 * @return {Object|undefined}
 */
const buildRequestFilters = (activeFilters) => {
  let filters;

  if (activeFilters) {
    filters = Object.keys(activeFilters).reduce((result, id) => {
      const filter = activeFilters[id];
      const converted = {
        label: filter.label,
        type: filter.type,
        ...(filter.source && { source: filter.source }),
      };

      if (filter.type === FILTER_TYPE_RANGE) {
        const [minimum, maximum] = filter.value;
        converted.minimum = minimum;
        converted.maximum = maximum;
      } else if (filter.type === FILTER_TYPE_MULTISELECT) {
        converted.values = filter.value.map(entry => entry.id);
      } else if (filter.type === FILTER_TYPE_SINGLE_SELECT) {
        converted.value = filter.value[0].id;
      }

      return {
        ...result,
        [id]: converted,
      };
    }, {});
  }

  return filters;
};

export default buildRequestFilters;
