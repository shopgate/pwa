// @flow
import { i18n } from '@shopgate/engage/core';

/**
 * Formats a numeric distance value.
 * @param {number} distance The original distance
 * @param {boolean} [imperial=false] Whether the original distance is imperial or metric
 * @returns {string}
 */
const formatDistance = (distance: number, imperial: boolean = false): string => {
  let distanceAltered = distance;
  let precision = 0;
  let unit;

  if (imperial === true) {
    unit = 'mi';

    // 0.094 mi === 500 ft
    if (distance <= 0.094) {
      unit = 'ft';
      distanceAltered = distance * 5280;
    } else if (distance < 100) {
      precision = 1;
    }
  } else {
    unit = 'km';

    if (distance < 1) {
      unit = 'm';
      distanceAltered = distance * 1000;
    } else if (distance >= 1 && distance < 100) {
      precision = 1;
    }
  }

  // Round small distances down to next 10
  if (['m', 'ft'].includes(unit)) {
    distanceAltered = Math.floor(distanceAltered / 10) * 10;
  }

  // Remove trailing zeros
  if (distanceAltered % 1 === 0) {
    precision = 0;
  }

  return i18n.text(
    'formats.distance.pattern', {
      distance: i18n.number(distanceAltered, precision),
      unit: i18n.text(`formats.distance.units.${unit}`),
    }
  );
};

export default formatDistance;
