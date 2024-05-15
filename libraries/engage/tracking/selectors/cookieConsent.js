import { createSelector } from 'reselect';

/**
 * Selects the cookie consent modal state.
 * @param {Object} state The current state of the cookie consent modal.
 * @returns {Object} whether cookie consent modal is shown.
 */
export const getCookieConsentModalState = state => state?.cookieConsent?.cookieConsentModal || {};

/**
 * Selects the cookie settings state.
 * @param {Object} state The current state of the cookie settings.
 * @returns {Object} whether cookies have been selected by the user.
 */
export const getCookieSettingsState = state => state?.cookieConsent?.cookieSettings || {};

/**
 * Selects the property of the comfort cookie settings.
 * @returns {boolean|null} whether comfort cookies have been selected by the user.
 */
export const getAreComfortCookiesActive = createSelector(
  getCookieSettingsState,
  modalState => modalState.areComfortCookiesActive
);

/**
 * Selects the property of the statistics cookie settings.
 * @returns {boolean|null} whether statistics cookies have been selected by the user.
 */
export const getAreStatisticsCookiesActive = createSelector(
  getCookieSettingsState,
  modalState => modalState.areStatisticsCookiesActive
);

/**
 * Selects the property of the comfort cookie settings
 * and returns true for tracking in case cookie feature is not activated (i.e. null)
 * @returns {boolean} whether comfort cookies are set and should activate tracking.
 */
export const getAreComfortCookiesSet = createSelector(
  getCookieSettingsState,
  (modalState) => {
    if (modalState.areComfortCookiesActive === null) return true;
    return modalState.areComfortCookiesActive;
  }
);

/**
 * Selects the property of the statistics cookie settings
 * and returns true for tracking in case cookie feature is not activated (i.e. null)
 * @returns {boolean} whether statistics cookies are set and should activate tracking.
 */
export const getAreStatisticsCookiesSet = createSelector(
  getCookieSettingsState,
  (modalState) => {
    if (modalState.areStatisticsCookiesActive === null) return true;
    return modalState.areStatisticsCookiesActive;
  }
);

/**
 * Selects the visibility property of the cookie consent modal.
 * @returns {boolean} whether cookie consent modal is shown.
 */
export const getIsCookieConsentModalVisible = createSelector(
  getCookieConsentModalState,
  getAreComfortCookiesActive,
  getAreStatisticsCookiesActive,
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
  modalState => (modalState?.areComfortCookiesActive !== null)
    || (modalState?.areStatisticsCookiesActive !== null)
);
