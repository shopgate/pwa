import { produce } from 'immer';
import type { Reducer, UnknownAction } from 'redux';
import type { AppSettingsSlice } from '../types/appSettings';
import type { ReceiveAppSettingsAction } from '../action-creators/appSettings';
import { RECEIVE_APP_SETTINGS } from '../constants/appSettings';

type AppSettingsAction = ReceiveAppSettingsAction | UnknownAction;

const isReceiveAppSettingsAction = (
  action: AppSettingsAction
): action is ReceiveAppSettingsAction => (
  action.type === RECEIVE_APP_SETTINGS && 'settings' in action
);

/**
 * The built-in default app settings. Used as the reducer's initial state and as
 * a safe fallback for selectors when the slice is not present in the store yet.
 */
export const DEFAULT_APP_SETTINGS: AppSettingsSlice = {
  isHydrated: false,
  navigation: {
    menubar: {
      style: 'fixed',
      showLabels: true,
      hideOnScroll: false,
      transition: 'fade',
    },
  },
};

/**
 * Stores the app settings.
 * @param state The current state.
 * @param action The action object.
 * @returns The new state.
 */
const appSettings: Reducer<AppSettingsSlice, AppSettingsAction> = (
  state,
  action = { type: '' }
) => produce(state ?? DEFAULT_APP_SETTINGS, (draft: AppSettingsSlice) => {
  if (isReceiveAppSettingsAction(action)) {
    Object.assign(draft, action.settings);
    draft.isHydrated = true;
  }
});

export default appSettings;
