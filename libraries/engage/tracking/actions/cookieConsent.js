import { historyPush } from '@shopgate/pwa-common/actions/router';
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
export const acceptAllCookies = ({
  areComfortCookiesSelected,
  areStatisticsCookiesSelected,
}) => (dispatch) => {
  dispatch(updateCookieConsent({
    areComfortCookiesSelected,
    areStatisticsCookiesSelected,
  }));
  dispatch(hideCookieConsentModal());
  dispatch(historyPush({ pathname: '/' }));
};

/**
 * action to be dispatched when the user accepted the selected cookies in the custom modal
 * and native modal should be triggered for setting the permission
 * @param {boolean|null} areComfortCookiesSelected whether this cookie type was selected by user
 * @param {boolean|null} areStatisticsCookiesSelected whether this cookie type was selected by user
 * @returns {Function}
 */
export const acceptSelectedCookies = ({
  areComfortCookiesSelected,
  areStatisticsCookiesSelected,
}) => (dispatch) => {
  dispatch(updateCookieConsent({
    areComfortCookiesSelected,
    areStatisticsCookiesSelected,
  }));
  dispatch(hideCookieConsentModal());
  dispatch(historyPush({ pathname: '/' }));
};

/**
 * action to be dispatched when the user selected only the required cookies in the custom modal
 * and native modal should be triggered for setting the permission
 * @returns {Function}
 */
export const acceptRequiredCookies = ({
  areComfortCookiesSelected,
  areStatisticsCookiesSelected,
}) => (dispatch) => {
  dispatch(updateCookieConsent({
    areComfortCookiesSelected,
    areStatisticsCookiesSelected,
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
