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

const defaultState: AppSettingsSlice = {
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
) => produce(state ?? defaultState, (draft: AppSettingsSlice) => {
  if (isReceiveAppSettingsAction(action)) {
    Object.assign(draft, action.settings);
    draft.isHydrated = true;
  }
});

export default appSettings;
