import { produce } from 'immer';
import { isDev } from '@shopgate/engage/core/helpers';
import {
  DEVELOPMENT_TOOLS_TOGGLE_INSETS,
  DEVELOPMENT_TOOLS_TOGGLE_INSET_HIGHLIGHT,
} from '../constants';

/**
 * @typedef {Object} DevToolsSettingsState
 * @property {boolean} showInsets
 * @property {boolean} showInsetHighlight
 */

/** @type DevToolsSettingsState */
const initialState = {
  showInsets: null,
  showInsetHighlight: false,
};

/**
 * The reducer for all development tools settings related states.
 * @param {Object} state The application state.
 * @param {Object} action The redux action.
 * @returns {Object}
 */
export default function settingsReducer(state = initialState, action) {
  /* eslint-disable no-param-reassign */
  const producer = produce(/** @param {DevToolsSettingsState} draft The draft */ (draft) => {
    if (!isDev) {
      return;
    }

    switch (action.type) {
      case DEVELOPMENT_TOOLS_TOGGLE_INSETS: {
        draft.showInsets = action.visible;
        break;
      }

      case DEVELOPMENT_TOOLS_TOGGLE_INSET_HIGHLIGHT: {
        draft.showInsetHighlight = action.visible;
        break;
      }
      default:
        break;
    }
  });
  /* eslint-enable no-param-reassign */
  return producer(state);
}

