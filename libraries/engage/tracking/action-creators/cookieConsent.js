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
 * @param {boolean|null} areComfortCookiesSelected whether this cookie type was selected by user
 * @param {boolean|null} areStatisticsCookiesSelected whether this cookie type was selected by user
 * @returns {Function}
 */
export const updateCookieConsent = ({
  areComfortCookiesSelected,
  areStatisticsCookiesSelected,
}) => ({
  type: UPDATE_COOKIE_CONSENT,
  areComfortCookiesSelected,
  areStatisticsCookiesSelected,
});

/**
 * action to be dispatched when the cookies have been handled either by user or by merchant
 * * and native modal should be triggered for setting the permission
 * @param {boolean|null} areComfortCookiesSelected whether this cookie type was selected by user
 * @param {boolean|null} areStatisticsCookiesSelected whether this cookie type was selected by user
 * @returns {Function}
 */
export const handleCookieConsent = ({
  areComfortCookiesSelected,
  areStatisticsCookiesSelected,
}) => ({
  type: COOKIE_CONSENT_HANDLED,
  areComfortCookiesSelected,
  areStatisticsCookiesSelected,
});
