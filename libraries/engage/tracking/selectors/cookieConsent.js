import { createSelector } from 'reselect';

/**
 * Selects the cookie consent modal state.
 * @param {Object} state The current state of the cookie consent modal.
 * @returns {Object} whether cookie consent modal is shown.
 */
export const getCookieConsentModalState = state => state?.tracking?.cookieConsentModal || {};

/**
 * Selects the cookie settings state.
 * @param {Object} state The current state of the cookie settings.
 * @returns {Object} whether cookies have been accepted by the user.
 */
export const getCookieSettingsState = state => state?.tracking?.cookieSettings || {};

/**
 * Selects the property of the comfort cookie settings.
 * @private This selector is intended to be used internally. When a cookie consent status needs
 * to be checked for a feature, please use `getAreComfortCookiesAccepted` instead.
 * @returns {boolean|null} whether comfort cookies have been selected by the user.
 */
export const getAreComfortCookiesAcceptedInternal = createSelector(
  getCookieSettingsState,
  settingsState => settingsState.comfortCookiesAccepted
);

/**
 * Selects the property of the statistics cookie settings.
 * @private This selector is intended to be used internally. When a cookie consent status needs
 * to be checked for a feature, please use `getAreStatisticsCookiesAccepted` instead.
 * @returns {boolean|null} whether statistics cookies have been selected by the user.
 */
export const getAreStatisticsCookiesAcceptedInternal = createSelector(
  getCookieSettingsState,
  settingsState => settingsState.statisticsCookiesAccepted
);

/**
 * Determines if comfort cookies where accepted in the cookie consent process. When cookie
 * consent is inactive, the selector will also return true.
 * @returns {boolean} whether comfort cookies are set and should activate tracking.
 */
export const getAreComfortCookiesAccepted = createSelector(
  getCookieSettingsState,
  (settingsState) => {
    if (settingsState.comfortCookiesAccepted === null) return true;
    return settingsState.comfortCookiesAccepted;
  }
);

/**
 * Determines if statistics cookies where accepted in the cookie consent process. When cookie
 * consent is inactive, the selector will also return true.
 * @returns {boolean} whether statistics cookies are set and should activate tracking.
 */
export const getAreStatisticsCookiesAccepted = createSelector(
  getCookieSettingsState,
  (settingsState) => {
    if (settingsState.statisticsCookiesAccepted === null) return true;
    return settingsState.statisticsCookiesAccepted;
  }
);

/**
 * Selects the visibility property of the cookie consent modal.
 * @returns {boolean} whether cookie consent modal is shown.
 */
export const getIsCookieConsentModalVisible = createSelector(
  getCookieConsentModalState,
  getAreComfortCookiesAcceptedInternal,
  getAreStatisticsCookiesAcceptedInternal,
  (modalState, comfortCookiesState, statisticsCookiesState) => (
    modalState.isCookieConsentModalVisible
        && (comfortCookiesState === null && statisticsCookiesState === null))
);

/**
 * Selects the cookie consent settings property.
 * @returns {boolean} whether cookie consent settings have been chosen by the user.
 */
export const getIsCookieConsentHandled = createSelector(
  getCookieSettingsState,
  settingsState => (settingsState?.comfortCookiesAccepted !== null)
    || (settingsState?.statisticsCookiesAccepted !== null)
);
