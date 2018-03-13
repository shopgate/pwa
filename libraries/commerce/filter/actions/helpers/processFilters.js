
/**
 * Removes the display_amount filter from the filters list.
 * @param {Object} filters The filters.
 * @returns {Object} The processed filters.
 */
const processFilters = (filters) => {
  const newFilters = { ...filters };

  delete newFilters.display_amount;

  return newFilters;
};

export default processFilters;
