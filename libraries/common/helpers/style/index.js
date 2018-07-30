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

/**
 * Returns an object ready to use with glamor with one pixel size property.
 * For example physicalPixelSize('height', 1) would result in:
 * - height: 1px for screen density 1,
 * - height: 0.5px for screen density 2,
 *
 * @param {string} property Css property name.
 * @param {number} [size=1] Requested physical pixel size.
 * @returns {Object}
 */
export const physicalPixelSize = (property, size = 1) => {
  const double = Math.round((size / 2) * 100) / 100;
  const triple = Math.round((size / 3) * 100) / 100;

  return {
    [property]: size,
    '@media (min-device-pixel-ratio: 2)': {
      [property]: double,
    },
    '@media (-webkit-min-device-pixel-ratio: 2)': {
      [property]: double,
    },
    '@media (min-device-pixel-ratio: 3)': {
      [property]: triple,
    },
    '@media (-webkit-min-device-pixel-ratio: 3)': {
      [property]: triple,
    },
  };
};

