import { historyPush } from '@shopgate/pwa-common/actions/router';
import {
  finishCookiesConsent,
  grantAllCookies,
  grantRequiredCookies,
  grantSelectedCookies,
  hideCookieConsentModal,
} from '../action-creators';
import { COOKIE_CONSENT_PATTERN } from '../constants';

/**
 * action to be dispatched when the user accepted all cookies in the custom modal
 * and native modal should be triggered for setting the permission
 * @returns {Function}
 */
export const acceptAllCookies = () => async (dispatch) => {
  await dispatch(grantAllCookies());
  dispatch(finishCookiesConsent({
    areComfortCookiesSelected: true,
    areStatisticsCookiesSelected: true,
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
}) => async (dispatch) => {
  await dispatch(grantSelectedCookies({
    areComfortCookiesSelected,
    areStatisticsCookiesSelected,
  }));
  dispatch(finishCookiesConsent({
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
export const acceptRequiredCookies = () => async (dispatch) => {
  await dispatch(grantRequiredCookies({ useSettingsModal: true }));
  dispatch(finishCookiesConsent({
    areComfortCookiesSelected: false,
    areStatisticsCookiesSelected: false,
  }));
  dispatch(hideCookieConsentModal());
};

/**
 * action to be dispatched when the user opted to configure cookie settings in the custom modal
 * @returns {Function}
 */
export const openSettings = () => async (dispatch) => {
  dispatch(historyPush({ pathname: COOKIE_CONSENT_PATTERN }));
  dispatch(hideCookieConsentModal());
};
