import { PUSH_OPT_IN_MODAL } from '../constants';

const defaultState = {
  showPushOptInModal: false,
};

/**
 * Stores all the states related to the push Opt-In Modal functionality.
 * @param {Object} [state] The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
const pushOptInModalReducer = (state = defaultState, action) => {
  switch (action.type) {
    case PUSH_OPT_IN_MODAL: {
      return {
        ...state,
        showPushOptInModal: true,
      };
    }

    default:
      return state;
  }
};

export default pushOptInModalReducer;
