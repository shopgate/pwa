import configuration from '@shopgate/pwa-common/collections/Configuration';
import { logger } from '@shopgate/pwa-core/helpers';
import { DEFAULT_PRODUCTS_FETCH_PARAMS } from '@shopgate/pwa-common/constants/Configuration';
import { getFullImageSource, isBeta, loadImage } from '@shopgate/engage/core/helpers';
import { getThemeSettings } from '@shopgate/engage/core/config';
import { PRODUCT_IMAGE_BASE_WIDTHS } from '@shopgate/engage/settings/constants/imageSettings';
import { buildShowScheduledParams } from '../components/EffectivityDates/helpers';

export * from '@shopgate/pwa-common-commerce/product/helpers';
export * from '../components/Media/helpers';
export * from './redirects';

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
 * Whether the deprecation warning for getProductImageSettings has already been logged. Nulled
 * after the first log, so a single warning is emitted per session rather than one per render.
 */
let productImageSettingsWarning = 'getProductImageSettings() is deprecated. Use the "context" prop of ProductImage, or the useProductImageSettings hook from @shopgate/engage/settings/hooks, so that images follow the configured aspect ratio.';

/**
 * Provides the settings for ProductImages
 * @deprecated Use the "context" prop of ProductImage, or useProductImageSettings. This accessor
 * only reads the legacy theme configuration, so it does not pick up admin configured ratios.
 * @return {Object}
 */
export const getProductImageSettings = () => {
  if (productImageSettingsWarning) {
    logger.warn(productImageSettingsWarning);
    productImageSettingsWarning = null;
  }

  const appImages = getThemeSettings('AppImages');

  return {
    quality: 75,
    fillColor: 'FFFFFF,1',
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

/**
 * Load product image with given resolution
 * @param {string} src .
 * @param {Object} [resolution] The resolution to preload. Callers that render the image should
 * pass the one they render, so that the preload hits the same url. Falls back to the smallest
 * built-in pdp resolution at a 1:1 ratio.
 * @returns {Promise}
 */
export const loadProductImage = (src, resolution = null) => {
  const [baseWidth] = PRODUCT_IMAGE_BASE_WIDTHS.pdp;
  const res = resolution ?? {
    width: baseWidth,
    height: baseWidth,
  };

  return loadImage(getFullImageSource(src, res));
};
