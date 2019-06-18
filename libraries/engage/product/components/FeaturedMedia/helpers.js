import { APP_PLATFORM } from '@shopgate/pwa-common/constants/Configuration';
import { OS_ANDROID } from '@shopgate/pwa-common/constants/Device';
import configuration from '@shopgate/pwa-common/collections/Configuration';

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
export const buildFeaturedImageUrl = (url, params) => {
  const parsedUrl = new URL(url);

  const isAndroid = configuration.get(APP_PLATFORM) === OS_ANDROID;
  const format = isAndroid ? 'webp' : defaultParams.format;

  const merged = {
    ...defaultParams,
    format,
    quality: qualities[format],
    ...params,
  };

  Object.keys(merged).forEach(k => parsedUrl.searchParams.set(k, merged[k]));

  return parsedUrl.toString();
};

