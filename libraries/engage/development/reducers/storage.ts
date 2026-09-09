import { produce } from 'immer';
import type { Reducer, UnknownAction } from 'redux';
import { isDev } from '@shopgate/engage/core/helpers';
import { DEVELOPMENT_TOOLS_UPDATE_STATUS_BAR_STYLE_STORAGE } from '../constants';
import type { DevelopmentStorageAction } from '../action-creators/storage';
import type { DevelopmentStorageState } from '../types';

type StorageAction = DevelopmentStorageAction | UnknownAction;

// Narrowing in one place, since `UnknownAction` types `type` as a plain string and would keep the
// switch below from discriminating the union on its own.
const isStorageAction = (action: StorageAction): action is DevelopmentStorageAction =>
  action.type === DEVELOPMENT_TOOLS_UPDATE_STATUS_BAR_STYLE_STORAGE;

/**
 * The state the development storage starts out with.
 */
export const DEFAULT_DEVELOPMENT_STORAGE: DevelopmentStorageState = {
  statusBarStyle: {
    styles: {},
  },
};

/**
 * The reducer for all developer tools storage related states.
 * @param state The application state.
 * @param action The redux action.
 * @returns The new state.
 */
const storageReducer: Reducer<DevelopmentStorageState, StorageAction> = (
  state = DEFAULT_DEVELOPMENT_STORAGE,
  action = { type: '' }
) => produce(state, (draft) => {
  if (!isDev || !isStorageAction(action)) {
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

export default storageReducer;
