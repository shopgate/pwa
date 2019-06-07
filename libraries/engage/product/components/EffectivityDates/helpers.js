import { isAfter, isBefore } from '@shopgate/engage/core';

const ALWAYS = 'always';
const DAYS_BEFORE = 'daysBefore';
const NEVER = 'always';

/**
 * Decide if startDate hint should be shown
 * @param {Date} startDate product.startDate
 * @param {Object} [settings=null] settings
 * @returns {boolean}
 */
export const showStartDateHint = (startDate, settings = null) => {
  if (!startDate || !startDate.getDate()) {
    return false;
  }

  const {
    startDate: {
      showProducts = ALWAYS, // 'always|daysBefore|never',
      daysBefore = 0,
    } = {},
  } = settings || {};

  switch (showProducts) {
    case ALWAYS:
      return isBefore(Date.now(), startDate);

    case DAYS_BEFORE: {
      const now = Date.now();
      return isBefore(now, startDate)
      && isAfter(startDate, now.setDate(now.getDate() - daysBefore));
    }

    default:
    case NEVER:
      return false;
  }
};

/**
 * Decide if endDate hint should be shown
 * @param {Date} endDate product.endDate
 * @param {Object} [settings=null] settings default global settings
 * @returns {boolean}
 */
export const showEndDateHint = (endDate, settings) => {
  if (!endDate || !endDate.getDate()) {
    return false;
  }

  const {
    endDate: {
      showProducts = ALWAYS, // 'always|daysBefore|never',
      daysBefore = 0,
    } = {},
  } = settings || {};

  switch (showProducts) {
    case ALWAYS:
      return true;

    case DAYS_BEFORE: {
      return isAfter(Date.now(), endDate.setDate(endDate.getDate() - daysBefore));
    }

    default:
    case NEVER:
      return false;
  }
};
