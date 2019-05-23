import { isBefore, isAfter } from '@shopgate/engage/core';

/**
 * Decide if startDate hint should be shown
 * @param {Object} settings settings
 * @param {Date} startDate product.startDate
 * @returns {boolean}
 */
export const showStartDateHint = (settings, startDate) => {
  if (!startDate || !startDate.getDate()) {
    return false;
  }

  const {
    showStartDate: {
      strategy = 'always', // 'always|daysBefore|never',
      daysBefore = 0,
    } = {},
  } = settings || {};

  switch (strategy) {
    case 'always':
      return isBefore(Date.now(), startDate);

    case 'daysBefore': {
      const now = Date.now();
      return isBefore(now, startDate)
      && isAfter(startDate, now.setDate(now.getDate() - daysBefore));
    }

    default:
    case 'never':
      return false;
  }
};

/**
 * Decide if endDate hint should be shown
 * @param {Object} settings settings
 * @param {Date} endDate product.endDate
 * @returns {boolean}
 */
export const showEndDateHint = (settings, endDate) => {
  if (!endDate || !endDate.getDate()) {
    return false;
  }

  const {
    showEndDate: {
      strategy = 'always', // 'always|daysBefore|never',
      daysBefore = 0,
    } = {},
  } = settings || {};

  switch (strategy) {
    case 'always':
      return true;

    case 'daysBefore': {
      return isAfter(Date.now(), endDate.setDate(endDate.getDate() - daysBefore));
    }

    default:
    case 'never':
      return false;
  }
};

