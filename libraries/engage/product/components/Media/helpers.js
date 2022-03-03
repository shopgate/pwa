import { getImageFormat } from '../../../core/helpers/getImageFormat';

const qualities = {
  jpeg: 75,
  png: 100,
  webp: 70,
};

const defaultParams = {
  width: 440,
  height: 440,
  quality: qualities.jpeg,
  fill: 'fff',
  format: 'jpeg',
};

/**
 * Append platform dimensions and quality to image url.
 * @param {string} url image url
 * @param {Object} [params=undefined] params
 * @returns {string}
 */
export const buildMediaImageUrl = (url, params) => {
  const parsedUrl = new URL(url);

  const format = getImageFormat();

  const merged = {
    ...defaultParams,
    format,
    quality: qualities[format],
    ...params,
  };

  Object.keys(merged).forEach(k => parsedUrl.searchParams.set(k, merged[k]));

  return parsedUrl.toString();
};

