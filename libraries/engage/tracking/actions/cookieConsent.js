import {
  historyPush,
  grantAppTrackingTransparencyPermission,
} from '@shopgate/engage/core/actions';
import { softOptInSelected } from '@shopgate/engage/core/action-creators';
import {
  updateCookieConsent,
  hideCookieConsentModal,
} from '../action-creators';
import { PRIVACY_SETTINGS_PATTERN } from '../constants';
import {
  getCookieConsentTrackingMeta,
  getIsCookieConsentModalVisible,
  getIsCookieConsentHandled,
} from '../selectors/cookieConsent';

/**
 * Broadcasts updates of the cookie consent states and dispatches related tracking events.
 * @param {Object} update Updated cookie consent states
 * @param {boolean} update.comfortCookiesAccepted Whether comfort cookies
 * are accepted.
 * @param {boolean} update.statisticsCookiesAccepted Whether statistics cookies
 * are accepted.
 * @returns {Function}
 */
const updateCookieConsentLocal = update => (dispatch, getState) => {
  const { comfortCookiesAccepted, statisticsCookiesAccepted } = update;
  const state = getState();

  // Whether the update was triggered by a button from within the modal
  const updateFromModal = getIsCookieConsentModalVisible(state);
  // Whether the cookie consent was already handled when the update came in
  const cookieConsentHandled = getIsCookieConsentHandled(state);

  if (!cookieConsentHandled) {
    // Prepare tracking events when cookie consent wasn't handled yet
    const meta = getCookieConsentTrackingMeta(state, {
      allowComfort: comfortCookiesAccepted,
      allowStatistics: statisticsCookiesAccepted,
    });

    let selection = 'manage';

    if (updateFromModal) {
      selection = comfortCookiesAccepted && statisticsCookiesAccepted ? 'approvedAll' : 'deniedAll';
    }

    dispatch(softOptInSelected({
      selection,
      meta,
    }));
  } else {
    // TODO implement "softTrackingSettingsChanged" event
  }

  // Broadcast the actual state update
  dispatch(updateCookieConsent(update));
};

/**
 * action to be dispatched when the user accepted all cookies in the custom modal
 * and native modal should be triggered for setting the permission
 * @returns {Function}
 */
export const acceptAllCookies = () => async (dispatch, getState) => {
  const meta = getCookieConsentTrackingMeta(getState());
  await dispatch(grantAppTrackingTransparencyPermission({ meta }));

  dispatch(updateCookieConsentLocal({
    comfortCookiesAccepted: true,
    statisticsCookiesAccepted: true,
  }));

  dispatch(hideCookieConsentModal());
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
}) => async (dispatch, getState) => {
  if (comfortCookiesAccepted || statisticsCookiesAccepted) {
    const meta = getCookieConsentTrackingMeta(getState());
    await dispatch(grantAppTrackingTransparencyPermission({ meta }));
  }

  dispatch(updateCookieConsentLocal({
    comfortCookiesAccepted,
    statisticsCookiesAccepted,
  }));

  dispatch(hideCookieConsentModal());
};

/**
 * action to be dispatched when the user selected only the required cookies in the custom modal
 * and native modal should be triggered for setting the permission
 * @returns {Function}
 */
export const acceptRequiredCookies = () => (dispatch) => {
  dispatch(updateCookieConsentLocal({
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
};
