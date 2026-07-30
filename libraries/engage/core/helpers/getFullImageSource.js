import { CONFIGURATION_COLLECTION_CREATE_EXTERNAL_IMAGE_URL } from '@shopgate/engage/core/constants';
import { configuration } from '@shopgate/engage/core/collections';
import {
  DEFAULT_IMAGE_FILL_COLOR,
  DEFAULT_IMAGE_FILL_TRANSPARENT,
  IMAGE_QUALITY,
} from '@shopgate/engage/settings/constants/imageSettings';
import { getImageFormat } from './getImageFormat';

/**
 * The settings applied when the caller passes none.
 */
const defaultSettings = {
  quality: IMAGE_QUALITY,
  fillColor: DEFAULT_IMAGE_FILL_COLOR,
  fillTransparent: DEFAULT_IMAGE_FILL_TRANSPARENT,
};

/**
 * Regex to detect the "fill" query parameter
 */
const fillParamRegex = /(fill|fillc)=(\w+)%2C(\d)($|&)/i;

/**
 * Appends image service parameters to an image service url
 * @param {string} baseUrl The base url
 * @param {Object} params Additional params for the url
 * @returns {string}
 */
const buildUrl = (baseUrl, params = {}) => {
  const parsedUrl = new URL(baseUrl);

  /**
   * To improve caching of images, we need to create urls with a consistent order of query params.
   * Otherwise it can happen that different urls create equal images, just because of different
   * ordered query params.
   * To reach this goal we utilize the "append" method of the URLSearchParams object and apply
   * the params in the order given by the "params" object. Since "append" could create duplicate
   * query params, each param needs to be removed from the URLSearchParams before it's added again.
   */
  Object.keys(params).forEach((key) => {
    parsedUrl.searchParams.delete(key);
    return parsedUrl.searchParams.append(key, params[key]);
  });

  /**
   * The "fill" parameter contains a ",". Since this would be url encoded by toString(), and the
   * service will not recognize it anymore, we need to replace the encoding with a ",".
   */
  return parsedUrl.toString().replace(fillParamRegex, '$1=$2,$3$4');
};

/**
 * Builds the url that requests an image at a given size. A src that no known image source
 * recognizes is returned untouched.
 * @param {string} src Source to the image.
 * @param {Object} dimension Dimension of the requested image.
 * @param {number} dimension.width Width in pixels.
 * @param {number} dimension.height Height in pixels.
 * @param {Object} [settings] Image service settings, as resolved by useImageServiceSettings.
 * @param {number} [settings.quality] Compression quality.
 * @param {string} [settings.fillColor] Fill color as a hash free hex, not a CSS color.
 * @param {boolean} [settings.fillTransparent] Whether transparent areas are filled too.
 * @returns {string}
 */
export const getFullImageSource = (src, { width, height } = {}, settings = {}) => {
  const {
    quality,
    fillColor,
    fillTransparent,
  } = {
    ...defaultSettings,
    ...settings,
  };

  if (src && src.includes('images.shopgate.services')) {
    const format = getImageFormat();

    return buildUrl(src, {
      format,
      width,
      height,
      quality,
      fill: fillTransparent ? `${fillColor},1` : fillColor,
    });
  }

  if (src && src.startsWith('https://img-cdn.shopgate.com') && !src.includes('?')) {
    return buildUrl(src, {
      w: width,
      h: height,
      q: quality,
      zd: 'resize',
      // No transparency flag here - the legacy cdn only understands a plain color.
      fillc: fillColor,
    });
  }

  // Check if an extension registered an external image url handler within the config collection.
  const createUrlFn = configuration.get(CONFIGURATION_COLLECTION_CREATE_EXTERNAL_IMAGE_URL);

  if (typeof createUrlFn === 'function') {
    const format = getImageFormat();

    // Invoke the handler with all relevant parameters.
    const externalUrl = createUrlFn(src, {
      width,
      height,
      fillColor,
      fillTransparent,
      quality,
      format,
    });

    if (!!externalUrl && typeof externalUrl === 'string') {
      return externalUrl;
    }
  }

  return src;
};
