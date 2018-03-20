import { createSelector } from 'reselect';
import {
  getSortOrder,
  getSearchPhrase,
} from '@shopgate/pwa-common/selectors/history';
import { generateResultHash } from '@shopgate/pwa-common/helpers/redux';

/**
 * Selects the container for search results.
 * @param {Object} state The current state.
 * @returns {Object} The search results.
 */
const resultsSelector = state => state.product.resultsByHash;

/**
 * Selects the product count for a search result.
 * @param {Object} state The current state.
 * @returns {number} The total product count.
 */
const resultCountSelector = createSelector(
  getSearchPhrase,
  getSortOrder,
  resultsSelector,
  (searchPhrase, sort, results) => {
    const hash = searchPhrase && generateResultHash({
      sort,
      searchPhrase,
    });

    if (!hash || !results[hash]) {
      return null;
    }

    return results[hash].totalResultCount;
  }
);

/**
 * Selects the search information.
 * @param {Object} state The current state.
 * @returns {Object} The search information.
 */
export default createSelector(
  getSearchPhrase,
  resultCountSelector,
  (query, resultCount) => {
    if (!query && !resultCount) {
      return null;
    }

    return {
      query,
      resultCount,
    };
  }
);
