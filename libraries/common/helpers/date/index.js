/**
 * @refactor install moment.js
 */

/**
 * Returns true if date exclusively before (<=).
 * @param {Date} date date object.
 * @param {Date} beforeDate comparison date.
 * @return {boolean}.
 */
export const isBefore = (date, beforeDate) => date < beforeDate;

/**
 * Returns true if date exclusively after (>=).
 * @param {Date} date date object.
 * @param {Date} afterDate comparison date.
 * @return {boolean}.
 */
export const isAfter = (date, afterDate) => date > afterDate;

/**
 * Returns true if date inclusively between (>= & <=).
 * @param {Date} date date object.
 * @param {Date} leftDate left bound.
 * @param {Date} rightDate right bound.
 * @return {boolean}.
 */
export const isBetween = (date, leftDate, rightDate) => (
  date >= leftDate && date <= rightDate
);
