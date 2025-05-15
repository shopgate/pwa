import { produce } from 'immer';
import { isDev } from '@shopgate/engage/core/helpers';
import {
  DEVELOPMENT_TOOLS_UPDATE_STATUS_BAR_STYLE_STORAGE,
} from '../constants';

/**
 * @typedef {Object} DevToolsStorageState
 * @property {Object} statusBarStyle
 */

/** @type DevToolsStorageState */
const initialState = {
  statusBarStyle: {
    styles: {},
  },
};

/**
 * The reducer for all developer tools storage related states.
 * @param {Object} state The application state.
 * @param {Object} action The redux action.
 * @returns {Object}
 */
export default function storageReducer(state = initialState, action) {
  /* eslint-disable no-param-reassign */
  const producer = produce(/** @param {DevToolsStorageState} draft The draft */ (draft) => {
    if (!isDev) {
      return;
    }
    switch (action.type) {
      case DEVELOPMENT_TOOLS_UPDATE_STATUS_BAR_STYLE_STORAGE: {
        draft.statusBarStyle = action.style;
        break;
      }

      default:
        break;
    }
  });
  /* eslint-enable no-param-reassign */
  return producer(state);
}

