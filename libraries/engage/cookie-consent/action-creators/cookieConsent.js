import {
  ACCEPT_ALL_COOKIES,
  ACCEPT_REQUIRED_COOKIES,
  ACCEPT_SELECTED_COOKIES,
  CHANGE_COMFORT_COOKIES,
  CHANGE_STATISTICS_COOKIES,
  HIDE_COOKIE_CONSENT_MODAL,
  SHOW_COOKIE_CONSENT_MODAL,
} from '../constants';

/**
 * action to be dispatched when the push opt-in should be shown
 * @returns {Function}
 */
export const showCookieConsentModal = () => ({
  type: SHOW_COOKIE_CONSENT_MODAL,
});

/**
 * action to be dispatched when the push opt-in should be hidden
 * @returns {Function}
 */
export const hideCookieConsentModal = () => ({
  type: HIDE_COOKIE_CONSENT_MODAL,
});

/**
 * action to be dispatched when the user accepted the selected cookies in the custom modal
 * and native modal should be triggered for setting the permission
 * @returns {Function}
 */
export const grantSelectedCookies = () => ({
  type: ACCEPT_SELECTED_COOKIES,
});

/**
 * action to be dispatched when the user accepted all cookies in the custom modal
 * and native modal should be triggered for setting the permission
 * @returns {Function}
 */
export const grantAllCookies = () => ({
  type: ACCEPT_ALL_COOKIES,
});

/**
 * action to be dispatched when the user accepted required cookies in the custom modal
 * and native modal should be triggered for setting the permission
 * @returns {Function}
 */
export const grantRequiredCookies = () => ({
  type: ACCEPT_REQUIRED_COOKIES,
});

/**
 * action to be dispatched when the user accepted all cookies in the custom modal
 * and native modal should be triggered for setting the permission
 * @returns {Function}
 */
export const handleChangeComfortCookies = () => ({
  type: CHANGE_COMFORT_COOKIES,
});

/**
 * action to be dispatched when the user accepted all cookies in the custom modal
 * and native modal should be triggered for setting the permission
 * @returns {Function}
 */
export const handleChangeStatisticsCookies = () => ({
  type: CHANGE_STATISTICS_COOKIES,
});
