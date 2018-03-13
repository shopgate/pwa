import { logger } from '@shopgate/pwa-core/helpers';
import { isNumber } from '../validation';

/**
 * Calculates a rem value for a passed pixel value. The calculation is based on the root
 * font size that is defined inside the template's font styles.
 * @param {number} pixels The source value
 * @returns {string} The result value
 */
export const rem = (pixels) => {
  let result = '';

  if (isNumber(pixels) && pixels >= 0) {
    result = `${(1 / 16) * pixels}rem`;
  } else {
    result = '1rem';
    logger.error(`rem(): Invalid value (${pixels})`);
  }

  return result;
};
