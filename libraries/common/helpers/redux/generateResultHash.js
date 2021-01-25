import { logger } from '@shopgate/pwa-core/helpers';
import * as pipelines from '../../constants/Pipelines';
import { generateSortedHash } from './generateSortedHash';

/**
 * Generates a hash for product collection results.
 * @param {Object} params The request parameters.
 * @param {boolean} [includeSort=true] Whether to include the sorting in the hash.
 * @param {boolean} [includeFilters=true] Whether to include the filters in the hash.
 * @param {string} [defaultSort=null] A default value for the sort parameter
 * @return {string} The generated hash.
 */
export function generateResultHash(
  params,
  includeSort = true,
  includeFilters = true,
  defaultSort = null
) {
  const defaultParams = {
    pipeline: pipelines.SHOPGATE_CATALOG_GET_PRODUCTS,
    ...includeFilters && { filters: {} },
    ...includeSort && defaultSort && { sort: defaultSort },
  };

  const mergedParams = {
    ...defaultParams,
    ...params,
  };

  if (includeSort && !mergedParams.sort) {
    logger.error('generateResultHash() needs to be called with a sort parameter when the sort is supposed to be included');
  }

  if (!includeSort && mergedParams.sort) {
    delete mergedParams.sort;
  }

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
