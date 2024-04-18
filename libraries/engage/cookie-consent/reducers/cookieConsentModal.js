import { HIDE_COOKIE_CONSENT_MODAL, SHOW_COOKIE_CONSENT_MODAL } from '../constants';

const defaultState = {
  isCookieConsentModalVisible: false,
};

/**
 * Stores all states of the cookie consent modal.
 * @param {Object} [state] The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
const cookieConsentModalReducer = (state = defaultState, action) => {
  switch (action.type) {
    case SHOW_COOKIE_CONSENT_MODAL: {
      return {
        ...state,
        isCookieConsentModalVisible: true,
      };
    }
    case HIDE_COOKIE_CONSENT_MODAL: {
      return {
        ...state,
        isCookieConsentModalVisible: false,
      };
    }

    default:
      return state;
  }
};

export default cookieConsentModalReducer;
