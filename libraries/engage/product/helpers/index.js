import configuration from '@shopgate/pwa-common/collections/Configuration';
import { DEFAULT_PRODUCTS_FETCH_PARAMS } from '@shopgate/pwa-common/constants/Configuration';
import { getThemeSettings, isBeta } from '@shopgate/engage/core';
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
      characteristics: true,
      ...scheduled.params,
    },
    ...scheduled.cachedTime && { cachedTime: scheduled.cachedTime },
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

/**
 * Provides the settings for ProductImages
 * @return {Object}
 */
export const getProductImageSettings = () => {
  const appImages = getThemeSettings('AppImages');

  return {
    quality: 75,
    fillColor: 'FFFFFF',
    HeroImage: [
      {
        width: 440,
        height: 440,
      },
      {
        width: 1024,
        height: 1024,
      },
    ],
    GalleryImage: [
      {
        width: 1024,
        height: 1024,
      },
      {
        width: 2048,
        height: 2048,
      },
    ],
    ListImage: [
      {
        width: 440,
        height: 440,
      },
    ],
    ...appImages,
  };
};
