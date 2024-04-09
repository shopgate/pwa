// import { historyPush } from '@shopgate/pwa-common/actions/router';
import {
  grantAllCookies,
  grantRequiredCookies,
  grantSelectedCookies,
  hideCookieConsentModal,
} from '../action-creators/cookieConsent';

/**
 * action to be dispatched when the user accepted all cookies in the custom modal
 * and native modal should be triggered for setting the permission
 * @returns {Function}
 */
export const acceptAllCookies = () => async (dispatch) => {
  await dispatch(grantAllCookies({ useSettingsModal: true }));
  dispatch(hideCookieConsentModal());
};

/**
 * action to be dispatched when the user accepted the selected cookies in the custom modal
 * and native modal should be triggered for setting the permission
 * @returns {Function}
 */
export const acceptSelectedCookies = () => async (dispatch) => {
  await dispatch(grantSelectedCookies({ useSettingsModal: true }));
  dispatch(hideCookieConsentModal());
};

/**
 * action to be dispatched when the user selected only the required cookies in the custom modal
 * and native modal should be triggered for setting the permission
 * @returns {Function}
 */
export const acceptRequiredCookies = () => async (dispatch) => {
  await dispatch(grantRequiredCookies({ useSettingsModal: true }));
  dispatch(hideCookieConsentModal());
};

/**
 * action to be dispatched when the user opted to configure cookie settings in the custom modal
 * @returns {Function}
 */
export const openSettings = () => async (dispatch) => {
  // TODO dispatch(historyPush({ pathname: '/cookie-consent' }));
  dispatch(hideCookieConsentModal());
};
