import { createSelector } from 'reselect';
import { appConfig } from '@shopgate/engage';
import { IS_PAGE_PREVIEW_ACTIVE } from '@shopgate/engage/page/constants';
import { appSupportsCookieConsent } from '@shopgate/engage/core/helpers';

const { cookieConsent: { isCookieConsentActivated, showComfortCookiesToggle } = {} } = appConfig;

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
 * Determines whether the cookie consent process is finished (selection happened before, feature is
 * inactive, app doesn't support the feature).
 * @returns {boolean} Whether the cookie consent process is handled either by user
 * or by app/feature settings
 */
export const getIsCookieConsentHandled = createSelector(
  getCookieSettingsState,
  (settingsState) => {
    if (!isCookieConsentActivated || !appSupportsCookieConsent() || IS_PAGE_PREVIEW_ACTIVE) {
      return true;
    }

    return (settingsState?.comfortCookiesAccepted !== null)
    || (settingsState?.statisticsCookiesAccepted !== null);
  }
);

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
 * Determines if comfort cookies were accepted in the cookie consent process. When cookie
 * consent is inactive, the selector will also return true.
 * @returns {boolean} whether comfort cookies are set and should activate tracking.
 */
export const getAreComfortCookiesAccepted = createSelector(
  getCookieSettingsState,
  getIsCookieConsentHandled,
  (settingsState, consentHandled) => {
    if (!consentHandled) return false;
    if (!isCookieConsentActivated || !showComfortCookiesToggle) return true;
    if (settingsState.comfortCookiesAccepted === null) return true;
    return settingsState.comfortCookiesAccepted;
  }
);

/**
 * Determines if statistics cookies were accepted in the cookie consent process. When cookie
 * consent is inactive, the selector will also return true.
 * @returns {boolean} whether statistics cookies are set and should activate tracking.
 */
export const getAreStatisticsCookiesAccepted = createSelector(
  getCookieSettingsState,
  getIsCookieConsentHandled,
  (settingsState, consentHandled) => {
    if (!consentHandled) return false;
    if (!isCookieConsentActivated) return true;
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
 * Determines if the cookie consent feature is activated
 */
export const getIsCookieConsentActivated = createSelector(
  () => isCookieConsentActivated && appSupportsCookieConsent()
);

/**
 * Creates a meta data object for tracking opt in tracking events
 */
export const getCookieConsentTrackingMeta = createSelector(
  getIsCookieConsentActivated,
  (_, props = {}) => props,
  (isActivated, states) => ({
    permission: 'tracking',
    usesSoftTrackingOptIn: isActivated,
    ...states,
  })
);
