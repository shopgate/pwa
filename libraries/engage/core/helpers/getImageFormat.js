import {
  isAndroidOs,
  isIOs,
} from '@shopgate/pwa-core';
import detector from 'detector';

/**
 * Gets the image format, which should be used
 * @returns {string} webp OR jpeg
 */
export const getImageFormat = () => {
  const format = isAndroidOs || (isIOs && detector.os.version >= 14) ? 'webp' : 'jpeg';
  return format;
};
