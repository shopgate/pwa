import { PAGE_PREVIEW_PATTERN } from '@shopgate/engage/page/constants';

/**
 * Retrieves the scroll container for the current page. Depending on the PWA mode this can be
 * a scrollable article element or the window.
 * @returns {HTMLElement|null}
 */
export const getScrollContainer = () => document.querySelector(`.route__${PAGE_PREVIEW_PATTERN.replace(/^\/+/, '')}`);

/**
 * @typedef {Object} ScheduledParams
 * @property {string} [from] The start date of the scheduling in ISO format.
 * @property {string} [to] The end date of the scheduling in ISO format.
 * @property {number} [timezoneOffset] The timezone offset in minutes. If not provided, the local
 * timezone offset will be used.
 */

/**
 * @typedef {Object} ScheduledStatus
 * @property {boolean} isScheduled Indicates if the widget is scheduled.
 * @property {boolean} isActive Indicates if the widget is currently active within the
 * scheduled time frame.
 * @property {boolean} isExpired Indicates if the scheduled time frame has expired.
 */

/**
 * Retrieves the scheduling status of a widget based on the provided parameters.
 * @param {ScheduledParams} [params] The parameters for the function.
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

  const isActive = (!fromDate || localNow >= new Date(fromDate.getTime() + offsetMs)) &&
                      (!toDate || localNow <= new Date(toDate.getTime() + offsetMs));

  const isExpired = !!toDate && localNow > new Date(toDate.getTime() + offsetMs);
  const isScheduled = !!fromDate || !!toDate;
  return {
    isScheduled,
    isActive,
    isExpired,
  };
}

/**
 * Regular expression source that a "*" within an allowed origin pattern is replaced with. It
 * matches one or more domain labels, but never a dot at the very end, so that the suffix of the
 * pattern stays anchored to the end of the origin.
 */
const ORIGIN_WILDCARD_SOURCE = '(?:[a-zA-Z0-9-]+\\.)*[a-zA-Z0-9-]+';

// Cache for regular expressions that were already created from an origin pattern.
const originPatternCache = new Map();

/**
 * Converts an allowed origin pattern into an anchored regular expression. Every character except
 * the "*" wildcard is matched literally.
 * @param {string} pattern The origin pattern e.g. "https://*.shopgate.com".
 * @returns {RegExp} The regular expression for the pattern.
 */
const createOriginRegExp = (pattern) => {
  const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`^${escaped.split('\\*').join(ORIGIN_WILDCARD_SOURCE)}$`);
};

/**
 * Checks if an origin is covered by a list of allowed origin patterns.
 * @param {string} origin The origin to check e.g. "https://app.shopgate.com".
 * @param {Array<string>} [patterns] The allowed origin patterns.
 * @returns {boolean} Whether the origin is allowed.
 */
export const isAllowedOrigin = (origin, patterns = []) => {
  // Opaque origins are serialized as "null" and must never be trusted.
  if (typeof origin !== 'string' || origin === '' || origin === 'null') {
    return false;
  }

  return patterns.some((pattern) => {
    if (typeof pattern !== 'string' || pattern === '') {
      return false;
    }

    if (!pattern.includes('*')) {
      return pattern === origin;
    }

    if (!originPatternCache.has(pattern)) {
      originPatternCache.set(pattern, createOriginRegExp(pattern));
    }

    return originPatternCache.get(pattern).test(origin);
  });
};

/**
 * Determines the origin of the document that embeds the current page.
 * @returns {string|null} The referrer origin, or null when it can't be determined.
 */
export const getReferrerOrigin = () => {
  try {
    return new URL(document.referrer).origin;
  } catch (e) {
    return null;
  }
};
