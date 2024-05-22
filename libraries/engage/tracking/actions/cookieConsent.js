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
    areComfortCookiesActive: true,
    areStatisticsCookiesActive: true,
  }));
  dispatch(hideCookieConsentModal());
  dispatch(historyPush({ pathname: '/' }));
};

/**
 * action to be dispatched when the user accepted the selected cookies in the custom modal
 * and native modal should be triggered for setting the permission
 * @param {boolean|null} areComfortCookiesActive whether this cookie type was selected by user
 * @param {boolean|null} areStatisticsCookiesActive whether this cookie type was selected by user
 * @returns {Function}
 */
export const acceptSelectedCookies = ({
  areComfortCookiesActive,
  areStatisticsCookiesActive,
}) => (dispatch) => {
  dispatch(updateCookieConsent({
    areComfortCookiesActive,
    areStatisticsCookiesActive,
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
    areComfortCookiesActive: false,
    areStatisticsCookiesActive: false,
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
