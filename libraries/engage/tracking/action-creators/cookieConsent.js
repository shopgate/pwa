import {
  UPDATE_COOKIE_CONSENT,
  COOKIE_CONSENT_HANDLED,
  HIDE_COOKIE_CONSENT_MODAL,
  SHOW_COOKIE_CONSENT_MODAL,
} from '../constants';

/**
 * action to be dispatched when the cookie consent modal should be shown
 * @returns {Function}
 */
export const showCookieConsentModal = () => ({
  type: SHOW_COOKIE_CONSENT_MODAL,
});

/**
 * action to be dispatched when the cookie consent modal should be hidden
 * @returns {Function}
 */
export const hideCookieConsentModal = () => ({
  type: HIDE_COOKIE_CONSENT_MODAL,
});

/**
 * action to be dispatched when the user accepted the selected cookies in the custom modal
 * @param {Object} params Action params
 * @param {boolean} [params.areComfortCookiesActive=false] whether this cookie type was selected
 * by user
 * @param {boolean} [params.areStatisticsCookiesActive=false] whether this cookie type was selected
 * by user
 * @returns {Function}
 */
export const updateCookieConsent = ({
  areComfortCookiesActive = false,
  areStatisticsCookiesActive = false,
}) => ({
  type: UPDATE_COOKIE_CONSENT,
  areComfortCookiesActive,
  areStatisticsCookiesActive,
});

/**
 * action to be dispatched when the cookies have been handled either by user or by merchant
 * and native modal should be triggered for setting the permission
 * @param {Object} params Action params
 * @param {boolean} [params.areComfortCookiesActive=false] whether this cookie type was selected
 * by user
 * @param {boolean} [params.areStatisticsCookiesActive=false] whether this cookie type was selected
 * by user
 * @returns {Function}
 */
export const handleCookieConsent = ({
  areComfortCookiesActive = false,
  areStatisticsCookiesActive = false,
}) => ({
  type: COOKIE_CONSENT_HANDLED,
  areComfortCookiesActive,
  areStatisticsCookiesActive,
});
