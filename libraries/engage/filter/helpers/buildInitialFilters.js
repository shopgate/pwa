import { FILTER_TYPE_RANGE } from '@shopgate/engage/filter';

/**
 * @param {Object} filters The available filters.
 * @param {Object} activeFilters The selected filters.
 * @returns {Object}
 */
export default function buildInitialFilters(filters, activeFilters) {
  const defaults = {};

  if (!filters) {
    return defaults;
  }

  filters.forEach((filter) => {
    const {
      id, maximum, minimum, type,
    } = filter;

    defaults[id] = {
      type,
      value: (type === FILTER_TYPE_RANGE) ? [minimum, maximum] : [],
    };
  });

  return {
    ...defaults,
    ...activeFilters,
  };
}
