import {
  COOKIE_CONSENT_COOKIE_NAME_STATUS,
  COOKIE_CONSENT_COOKIE_NAME_PREFS,
  COOKIE_CONSENT_STATUS_ALLOW,
  COOKIE_CONSENT_PREF_ANALYTICS,
} from '../constants';

/**
 * @param {string} name The cookie name
 * @returns {string}
 */
const getCookieValue = (name) => {
  const b = document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`);
  return b ? b.pop() : '';
};

/**
 * Checks if tracking is allowed
 * @returns {bool}
 */
export const isTrackingAllowed = () => {
  const status = getCookieValue(COOKIE_CONSENT_COOKIE_NAME_STATUS);
  let prefs = getCookieValue(COOKIE_CONSENT_COOKIE_NAME_PREFS);

  if (status !== COOKIE_CONSENT_STATUS_ALLOW) {
    return false;
  }

  try {
    prefs = JSON.parse(decodeURIComponent(prefs));

    if (!Array.isArray(prefs)) {
      prefs = [];
    }
  } catch (e) {
    prefs = [];
  }

  return prefs.includes(COOKIE_CONSENT_PREF_ANALYTICS);
};
