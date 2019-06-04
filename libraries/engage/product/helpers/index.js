import { isBeta } from '@shopgate/engage/core';

import { buildShowScheduledParams } from '../components/EffectivityDates/helpers';

/**
 * Build params to fetch category products
 * @returns {undefined|{params: Object}}
 */
export const buildFetchCategoryProductsParams = () => {
  if (!isBeta()) {
    return {
      params: {},
    };
  }

  const scheduled = buildShowScheduledParams();

  return {
    params: {
      ...scheduled.params,
    },
    ...scheduled.cachedTime && { cachedTime: scheduled.cachedTime },
  };
};

/**
 * Build params to fetch search products. Same as category for now
 * @returns {undefined|{params: Object}}
 */
export const buildFetchSearchResultsParams = () => buildFetchCategoryProductsParams();
