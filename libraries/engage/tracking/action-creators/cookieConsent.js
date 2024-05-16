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
 * @param {boolean|null} areComfortCookiesActive whether this cookie type was selected by user
 * @param {boolean|null} areStatisticsCookiesActive whether this cookie type was selected by user
 * @returns {Function}
 */
export const updateCookieConsent = ({
  areComfortCookiesActive,
  areStatisticsCookiesActive,
}) => ({
  type: UPDATE_COOKIE_CONSENT,
  areComfortCookiesActive,
  areStatisticsCookiesActive,
});

/**
 * action to be dispatched when the cookies have been handled either by user or by merchant
 * * and native modal should be triggered for setting the permission
 * @param {boolean|null} areComfortCookiesActive whether this cookie type was selected by user
 * @param {boolean|null} areStatisticsCookiesActive whether this cookie type was selected by user
 * @returns {Function}
 */
export const handleCookieConsent = ({
  areComfortCookiesActive,
  areStatisticsCookiesActive,
}) => ({
  type: COOKIE_CONSENT_HANDLED,
  areComfortCookiesActive,
  areStatisticsCookiesActive,
});
