import {
  getThemeSettings, isBeta, isAfter, isBefore, addDuration,
} from '@shopgate/engage/core';
import { ALWAYS, NEVER } from './constants';

/**
 * Biuld params to fetch category products
 * @returns {Object|{showScheduled: string}}
 */
export const buildShowScheduledParams = () => {
  if (!isBeta()) {
    return {};
  }

  let cachedTime = null;
  let { effectivityDates: { showScheduled } = {} } = getThemeSettings('product') || {};

  if (showScheduled === ALWAYS) {
    showScheduled = 'P1Y';
  } else if (showScheduled === NEVER) {
    showScheduled = 'PT0S';
    cachedTime = 60000; // 1 minute min effective precision
  }

  return {
    cachedTime,
    params: {
      showScheduled,
    },
  };
};

/**
 * Decide if startDate hint should be shown
 * @param {Date} startDate product.startDate
 * @param {Object} [settings=null] settings
 * @returns {boolean}
 */
export const showScheduledLabel = (startDate, settings = null) => {
  if (!startDate || !startDate.getDate()) {
    return false;
  }

  const now = new Date();
  if (isBefore(startDate, now)) {
    return false;
  }

  const {
    scheduledProducts: {
      showLabels = ALWAYS, // 'always|P2D|never',
    } = {},
  } = settings || {};

  if (showLabels === NEVER) {
    return false;
  }
  if (showLabels === ALWAYS) {
    return true;
  }

  const cloned = new Date(startDate.getTime());
  addDuration(cloned, `-${showLabels}`);

  return isAfter(now, cloned);
};

/**
 * Decide if endDate hint should be shown
 * @param {Date} endDate product.endDate
 * @param {Object} [settings=null] settings default global settings
 * @returns {boolean}
 */
export const showExpiringLabel = (endDate, settings) => {
  if (!endDate || !endDate.getDate()) {
    return false;
  }

  const {
    expiringProducts: {
      showLabels = ALWAYS, // 'always|P2D|never',
    } = {},
  } = settings || {};

  if (showLabels === NEVER) {
    return false;
  }
  if (showLabels === ALWAYS) {
    return true;
  }

  const now = new Date();
  const cloned = new Date(endDate.getTime());
  addDuration(cloned, `-${showLabels}`);

  return isAfter(now, cloned);
};
