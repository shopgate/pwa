/**
 * @param {Object} initialFilters The filters before they where modified.
 * @param {Object} updatedFilters The filters after they where modified.
 * @return {Object}
 */
export default function buildUpdatedFilters(initialFilters, updatedFilters) {
  // Create a set of active filters by combining state and updatedFilters.
  const activeFilters = {
    ...initialFilters,
    ...updatedFilters,
  };

  return Object.keys(activeFilters).reduce((result, filterId) => {
    const filter = activeFilters[filterId];

    if (filterId === 'display_amount') {
      const [min, max] = filter.value;

      // Take care that the values for the display amount reflect the state of the price slider.
      filter.value = [
        Math.floor(min / 100) * 100,
        Math.ceil(max / 100) * 100,
      ];
    }

    if (filter.value.length) {
      // Only add filters with selected values.
      return {
        ...(result === null ? {} : result),
        [filterId]: filter,
      };
    }

    return result;
  }, null);
}
