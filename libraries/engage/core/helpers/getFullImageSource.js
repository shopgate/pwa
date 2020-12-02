import { isAndroidOs } from '@shopgate/pwa-core';
import { getProductImageSettings } from '../../product/helpers';

/**
 * Returns the actual url to the image, by adding url parameters with the dimensions for img-cdn
 * @param {string} src Source to the image.
 * @param {Object} dimension Dimension of the requested image.
 * @param {number} dimension.width Width in pixels.
 * @param {number} dimension.height Height in pixels.
 * @returns {string}
 */
export const getFullImageSource = (src, { width, height }) => {
  if (src && src.includes('images.shopgate.services/v2/images')) {
    const { fillColor, quality } = getProductImageSettings();
    const format = isAndroidOs ? 'webp' : 'jpeg';

    return `${src}&format=${format}&width=${width}&height=${height}&quality=${quality}&fill=${fillColor.replace('#', '')}`;
  }

  if (src && src.startsWith('https://img-cdn.shopgate.com') && !src.includes('?')) {
    return `${src}?w=${width}&h=${height}&q=70&zc=resize&fillc=FFFFFF`;
  }

  return src;
};
