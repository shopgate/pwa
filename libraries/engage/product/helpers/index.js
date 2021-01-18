import configuration from '@shopgate/pwa-common/collections/Configuration';
import { DEFAULT_PRODUCTS_FETCH_PARAMS } from '@shopgate/pwa-common/constants/Configuration';
import { isBeta } from '@shopgate/engage/core';

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

  return {
    params: {
      characteristics: true,
    },
  };
};

/**
 * Build params to fetch search products. Same as category for now
 * @returns {undefined|{params: Object}}
 */
export const buildFetchSearchResultsParams = buildFetchCategoryProductsParams;

/**
 * Set default params for fetching products
 */
export const setDefaultProductFetchParams = () => {
  if (!isBeta()) {
    return;
  }
  configuration.set(DEFAULT_PRODUCTS_FETCH_PARAMS, {
    characteristics: true,
  });
};

