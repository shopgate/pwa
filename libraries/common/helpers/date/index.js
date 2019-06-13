/**
 * @refactor install moment.js
 */
const durationRegex = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;

const durationModifiers = {
  Year: (date, unit) => date.setFullYear(date.getFullYear() + unit),
  Month: (date, unit) => date.setMonth(date.getMonth() + unit),
  Week: (date, unit) => date.setDate(date.getDate() + (unit * 7)),
  Day: (date, unit) => date.setDate(date.getDate() + unit),
  Hour: (date, unit) => date.setHours(date.getHours() + unit),
  Minute: (date, unit) => date.setMinutes(date.getMinutes() + unit),
  Second: (date, unit) => date.setSeconds(date.getSeconds() + unit),
};

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

/**
 * Parse duration
 * @param {string} duration ISO 8601 duration.
 * @return {Object}
 */
export const parseDuration = (duration) => {
  const d = durationRegex.exec(duration) || [];
  const fr = d[1] === '-' ? -1 : 1;
  return {
    Year: d[2] && (d[2] > 0 ? d[2] * fr : d[2]),
    Month: d[3] && (d[3] > 0 ? d[3] * fr : d[3]),
    Week: d[4] && (d[4] > 0 ? d[4] * fr : d[4]),
    Day: d[5] && (d[5] > 0 ? d[5] * fr : d[5]),
    Hour: d[6] && (d[6] > 0 ? d[6] * fr : d[6]),
    Minute: d[7] && (d[7] > 0 ? d[7] * fr : d[7]),
    Second: d[8] && (d[8] > 0 ? d[8] * fr : d[8]),
  };
};

/**
 * Add duration to given date
 * @param {Date} date date object.
 * @param {string} duration ISO 8601 duration.
 * @return {void}
 */
export const addDuration = (date, duration) => {
  const parsed = parseDuration(duration);

  Object.keys(parsed).forEach((k) => {
    if (parsed[k]) {
      durationModifiers[k](date, parsed[k]);
    }
  });
};

