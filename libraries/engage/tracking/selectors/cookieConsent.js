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
 * @returns {boolean} whether comfort cookies have been selected by the user.
 */
export const getAreComfortCookiesSelected = createSelector(
  getCookieSettingsState,
  modalState => modalState.areComfortCookiesSelected || false
);

/**
 * Selects the property of the statistics cookie settings.
 * @returns {boolean} whether statistics cookies have been selected by the user.
 */
export const getAreStatisticsCookiesSelected = createSelector(
  getCookieSettingsState,
  modalState => modalState.areStatisticsCookiesSelected || false
);

/**
 * Selects the property of the cookie consent modal.
 * @returns {boolean} whether cookie consent modal is shown.
 */
export const getIsCookieConsentModalVisible = createSelector(
  getCookieConsentModalState,
  getAreComfortCookiesSelected,
  getAreStatisticsCookiesSelected,
  (modalState, comfortCookiesState, statisticsCookiesState) => (
    modalState.isCookieConsentModalVisible
      && (comfortCookiesState !== null
        && statisticsCookiesState !== null))
    || false
);

/**
 * Selects the property of the cookie consent settings.
 * @returns {boolean} whether cookie consent options have been chosen by the user.
 */
export const getIsCookieConsentHandled = createSelector(
  getCookieConsentModalState,
  modalState => modalState?.isCookieConsentHandled || false
);
