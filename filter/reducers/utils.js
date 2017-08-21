import kebabCase from 'lodash/kebabCase';
import { FILTER_PATH } from '../constants';

/**
 * Enriches a filter object with additional properties.
 * @param {Array} filters The filters collection.
 * @return {Array} The new collection of enriched filters.
 */
export const enrichFilters = filters => filters.map(filter => ({
  ...filter,
  // The route url of this filter.
  url: `${FILTER_PATH}/${kebabCase(filter.id)}`,
}));
