import { produce } from 'immer';
import type { Reducer, UnknownAction } from 'redux';
import { isDev } from '@shopgate/engage/core/helpers';
import {
  DEVELOPMENT_TOOLS_TOGGLE_INSETS,
  DEVELOPMENT_TOOLS_TOGGLE_INSET_HIGHLIGHT,
  DEVELOPMENT_TOOLS_TOGGLE_CMS2_PREVIEW,
  DEVELOPMENT_TOOLS_TOGGLE_COLOR_SCHEME_SELECTION,
} from '../constants';
import type { DevelopmentSettingsAction } from '../action-creators/settings';
import type { DevelopmentSettingsState } from '../types';

type SettingsAction = DevelopmentSettingsAction | UnknownAction;

const HANDLED_ACTION_TYPES: string[] = [
  DEVELOPMENT_TOOLS_TOGGLE_INSETS,
  DEVELOPMENT_TOOLS_TOGGLE_INSET_HIGHLIGHT,
  DEVELOPMENT_TOOLS_TOGGLE_CMS2_PREVIEW,
  DEVELOPMENT_TOOLS_TOGGLE_COLOR_SCHEME_SELECTION,
];

// Narrowing in one place, since `UnknownAction` types `type` as a plain string and would keep the
// switch below from discriminating the union on its own.
const isSettingsAction = (action: SettingsAction): action is DevelopmentSettingsAction =>
  HANDLED_ACTION_TYPES.includes(action.type as string);

/**
 * The state the development settings start out with.
 */
export const DEFAULT_DEVELOPMENT_SETTINGS: DevelopmentSettingsState = {
  showInsets: null,
  showInsetHighlight: false,
  cms2PreviewEnabled: false,
  colorSchemeSelectionEnabled: false,
};

/**
 * The reducer for all development tools settings related states.
 * @param state The application state.
 * @param action The redux action.
 * @returns The new state.
 */
const settingsReducer: Reducer<DevelopmentSettingsState, SettingsAction> = (
  state = DEFAULT_DEVELOPMENT_SETTINGS,
  action = { type: '' }
) => produce(state, (draft) => {
  if (!isSettingsAction(action)) {
    return;
  }

  switch (action.type) {
    case DEVELOPMENT_TOOLS_TOGGLE_INSETS: {
      if (isDev) {
        draft.showInsets = action.visible;
      }
      break;
    }

    case DEVELOPMENT_TOOLS_TOGGLE_INSET_HIGHLIGHT: {
      if (isDev) {
        draft.showInsetHighlight = action.visible;
      }
      break;
    }

    case DEVELOPMENT_TOOLS_TOGGLE_CMS2_PREVIEW: {
      draft.cms2PreviewEnabled = action.enabled;
      break;
    }

    case DEVELOPMENT_TOOLS_TOGGLE_COLOR_SCHEME_SELECTION: {
      if (isDev) {
        draft.colorSchemeSelectionEnabled = action.enabled;
      }
      break;
    }

    default:
      break;
  }
});

export default settingsReducer;
