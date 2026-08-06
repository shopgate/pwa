import { produce } from 'immer';
import { merge } from 'lodash';
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
    tabBar: {
      variant: 'fixed',
      showLabels: true,
      hideOnScroll: false,
      transition: 'fade',
      fixed: {
        borderEnabled: true,
      },
      favorites: {
        showCounter: true,
      },
    },
  },
  productList: {
    grid: {
      columns: {
        xs: 2,
        md: 4,
      },
    },
    slider: {
      slidesPerView: {
        xs: 2.3,
        sm: 3.3,
        md: 4.3,
        lg: 5.3,
      },
    },
  },
  product: {
    rating: {
      showEmptyStars: true,
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
    // Deep merge so a partial payload (e.g. only some navigation.tabBar fields)
    // keeps the built-in defaults for anything the source omits, rather than
    // shallow-replacing whole branches and leaving consumers with undefined.
    merge(draft, action.settings);
    draft.isHydrated = true;
  }
});

export default appSettings;
