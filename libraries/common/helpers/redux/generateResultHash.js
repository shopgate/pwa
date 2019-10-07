import { DEFAULT_SORT } from '../../constants/DisplayOptions';
import * as pipelines from '../../constants/Pipelines';
import { generateSortedHash } from './generateSortedHash';

/**
 * Generates a hash for product collection results.
 * @param {Object} params The request parameters.
 * @param {boolean} [includeSort=true] Whether to include the sorting in the hash.
 * @param {boolean} [includeFilters=true] Whether to include the filters in the hash.
 * @return {string} The generated hash.
 */
export function generateResultHash(params, includeSort = true, includeFilters = true) {
  const defaultParams = {
    pipeline: pipelines.SHOPGATE_CATALOG_GET_PRODUCTS,
    ...includeFilters && { filters: {} },
    ...includeSort && { sort: DEFAULT_SORT },
  };

  const mergedParams = {
    ...defaultParams,
    ...params,
  };

  const { searchPhrase } = mergedParams;

  if (searchPhrase) {
    /**
     * We trim the search phrase here, because otherwise we will create different hash and cache
     * entries for the same search term (because whitespaces don't influence the search results)
     */
    mergedParams.searchPhrase = searchPhrase.trim();
  }

  return generateSortedHash(mergedParams);
}
