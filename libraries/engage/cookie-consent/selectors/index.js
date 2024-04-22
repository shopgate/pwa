import { createSelector } from 'reselect';

/**
 * Selects the cookie consent modal state.
 * @param {Object} state The current state of the cookie consent modal.
 * @returns {Object} whether cookie consent modal is shown.
 */
export const getCookieConsentModalState = state => state?.cookieConsent?.cookieConsentModal || {};

/**
 * Selects the comfort cookie settings state.
 * @param {Object} state The current state of the comfort cookie settings.
 * @returns {Object} whether comfort cookies have been selected by the user.
 */
export const getComfortCookiesSelectedState = state => state?.cookieConsent?.cookieSettings || {};

/**
 * Selects the property of the comfort cookie settings.
 * @returns {boolean} whether comfort cookies have been selected by the user.
 */
export const getAreComfortCookiesSelected = createSelector(
  getComfortCookiesSelectedState,
  modalState => modalState.areComfortCookiesSelected || false
);

/**
 * Selects the comfort cookie settings state.
 * @param {Object} state The current state of the statistics cookie settings.
 * @returns {Object} whether statistics cookies have been selected by the user.
 */
export const getStatisticsCookiesSelectedState = state => state?.cookieConsent?.cookieSettings
  || {};

/**
 * Selects the property of the statistics cookie settings.
 * @returns {boolean} whether statistics cookies have been selected by the user.
 */
export const getAreStatisticsCookiesSelected = createSelector(
  getStatisticsCookiesSelectedState,
  modalState => modalState.areStatisticsCookiesSelected || false
);

/**
 * Selects the property of the cookie consent modal.
 * @returns {boolean} whether cookie consent modal is shown.
 */
export const getIsCookieConsentModalVisible = createSelector(
  getCookieConsentModalState,
  getComfortCookiesSelectedState,
  getStatisticsCookiesSelectedState,
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
  (modalState) => {
    console.log('AYAY :65:modalState:', modalState);
    return modalState?.isCookieConsentHandled || false;
  }
);
