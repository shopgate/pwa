import { getProductImageSettings } from '../../product/helpers';
import { getImageFormat } from './getImageFormat';

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
 * Returns the actual url to the image, by adding url parameters with the dimensions for img-cdn
 * @param {string} src Source to the image.
 * @param {Object} dimension Dimension of the requested image.
 * @param {number} dimension.width Width in pixels.
 * @param {number} dimension.height Height in pixels.
 * @returns {string}
 */
export const getFullImageSource = (src, { width, height } = {}) => {
  if (src && src.includes('images.shopgate.services/v2/images')) {
    const { fillColor, quality } = getProductImageSettings();
    const format = getImageFormat();

    return buildUrl(src, {
      format,
      width,
      height,
      quality,
      fill: fillColor.replace('#', ''),
    });
  }

  if (src && src.startsWith('https://img-cdn.shopgate.com') && !src.includes('?')) {
    return buildUrl(src, {
      w: width,
      h: height,
      q: 70,
      zd: 'resize',
      fillc: 'FFFFFF',
    });
  }

  return src;
};
