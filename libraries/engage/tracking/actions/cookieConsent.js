import { historyPush } from '@shopgate/engage/core/actions';
import {
  updateCookieConsent,
  hideCookieConsentModal,
} from '../action-creators';
import { PRIVACY_SETTINGS_PATTERN } from '../constants';

/**
 * action to be dispatched when the user accepted all cookies in the custom modal
 * and native modal should be triggered for setting the permission
 * @returns {Function}
 */
export const acceptAllCookies = () => (dispatch) => {
  dispatch(updateCookieConsent({
    comfortCookiesAccepted: true,
    statisticsCookiesAccepted: true,
  }));
  dispatch(hideCookieConsentModal());
  dispatch(historyPush({ pathname: '/' }));
};

/**
 * action to be dispatched when the user accepted the selected cookies in the custom modal
 * and native modal should be triggered for setting the permission
 * @param {Object} params Action params
 * @param {boolean|null} params.comfortCookiesAccepted whether this cookie type was accepted
 * by user
 * @param {boolean|null} params.statisticsCookiesAccepted whether this cookie type was accepted
 * by user
 * @returns {Function}
 */
export const acceptSelectedCookies = ({
  comfortCookiesAccepted,
  statisticsCookiesAccepted,
}) => (dispatch) => {
  dispatch(updateCookieConsent({
    comfortCookiesAccepted,
    statisticsCookiesAccepted,
  }));
  dispatch(hideCookieConsentModal());
  dispatch(historyPush({ pathname: '/' }));
};

/**
 * action to be dispatched when the user selected only the required cookies in the custom modal
 * and native modal should be triggered for setting the permission
 * @returns {Function}
 */
export const acceptRequiredCookies = () => (dispatch) => {
  dispatch(updateCookieConsent({
    comfortCookiesAccepted: false,
    statisticsCookiesAccepted: false,
  }));
  dispatch(hideCookieConsentModal());
};

/**
 * action to be dispatched when the user opted to configure cookie settings in the custom modal
 * @returns {Function}
 */
export const openPrivacySettings = () => (dispatch) => {
  dispatch(historyPush({ pathname: PRIVACY_SETTINGS_PATTERN }));
  dispatch(hideCookieConsentModal());
};
