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
 * @returns {boolean|null} whether comfort cookies have been selected by the user.
 */
export const getAreComfortCookiesAccepted = createSelector(
  getCookieSettingsState,
  settingsState => settingsState.comfortCookiesAccepted
);

/**
 * Selects the property of the statistics cookie settings.
 * @returns {boolean|null} whether statistics cookies have been selected by the user.
 */
export const getAreStatisticsCookiesAccepted = createSelector(
  getCookieSettingsState,
  settingsState => settingsState.statisticsCookiesAccepted
);

/**
 * Selects the property of the comfort cookie settings
 * and returns true for tracking in case cookie feature is not activated (i.e. null)
 * @returns {boolean} whether comfort cookies are set and should activate tracking.
 */
export const getAreComfortCookiesSet = createSelector(
  getCookieSettingsState,
  (settingsState) => {
    if (settingsState.comfortCookiesAccepted === null) return true;
    return settingsState.comfortCookiesAccepted;
  }
);

/**
 * Selects the property of the statistics cookie settings
 * and returns true for tracking in case cookie feature is not activated (i.e. null)
 * @returns {boolean} whether statistics cookies are set and should activate tracking.
 */
export const getAreStatisticsCookiesSet = createSelector(
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
  getAreComfortCookiesAccepted,
  getAreStatisticsCookiesAccepted,
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
