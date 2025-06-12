import { PAGE_PREVIEW_PATTERN } from '@shopgate/engage/page/constants';

/**
 * Retrieves the scroll container for the current page. Depending on the PWA mode this can be
 * a scrollable article element or the window.
 * @returns {HTMLElement|null}
 */
export const getScrollContainer = () => document.querySelector(`.route__${PAGE_PREVIEW_PATTERN.replace(/^\/+/, '')}`);

/**
 * @typedef {Object} ScheduledParams
 * @param {string} [from] The start date of the scheduling in ISO format.
 * @param {string} [to] The end date of the scheduling in ISO format.
 * @param {number} [timezoneOffset] The timezone offset in minutes. If not provided, the local
 * timezone offset will be used.
 */

/**
 * @typedef {Object} ScheduledStatus
 * @param {boolean} isScheduled Indicates if the widget is scheduled.
 * @param {boolean} isHidden Indicates if the widget is currently hidden based on the scheduling.
 * @param {boolean} isExpired Indicates if the scheduled time frame has expired.
 */

/**
 * Retrieves the scheduling status of a widget based on the provided parameters.
 * @param {ScheduledParams} params The parameters for the function.
 * @returns {ScheduledStatus} An object containing the scheduling status.
 */
export function checkScheduled({ from, to, timezoneOffset } = {}) {
  const now = new Date();

  // Convert current time to provided or local timezone
  const localOffset = timezoneOffset ?? -now.getTimezoneOffset(); // in minutes
  const offsetMs = localOffset * 60 * 1000;
  const localNow = new Date(now.getTime() + offsetMs);

  const fromDate = from ? new Date(from) : null;
  const toDate = to ? new Date(to) : null;

  const inTimeframe = (!fromDate || localNow >= new Date(fromDate.getTime() + offsetMs)) &&
                      (!toDate || localNow <= new Date(toDate.getTime() + offsetMs));

  const isExpired = !!toDate && localNow > new Date(toDate.getTime() + offsetMs);
  const isScheduled = !!fromDate || !!toDate;
  return {
    isScheduled,
    isHidden: !inTimeframe,
    isExpired,
  };
}
