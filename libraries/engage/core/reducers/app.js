import { produce } from 'immer';
import {
  PWA_DID_APPEAR,
  PWA_DID_DISAPPEAR,
} from '@shopgate/pwa-common/constants/ActionTypes';

const defaultState = {
  webViewVisible: true,
};

/**
 * Stores app state
 * @param {Object} [state={}] The current state.
 * @param {Object} action The action object.
 * @returns {Object} The new state.
 */
export default function app(state = defaultState, action) {
  /* eslint-disable no-param-reassign */
  const producer = produce((draft) => {
    switch (action.type) {
      case PWA_DID_APPEAR: {
        draft.webViewVisible = true;
        break;
      }
      case PWA_DID_DISAPPEAR: {
        draft.webViewVisible = false;
        break;
      }
      default:
        break;
    }
  });
  /* eslint-enable no-param-reassign */

  return producer(state);
}
