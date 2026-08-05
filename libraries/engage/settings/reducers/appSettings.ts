import { merge } from 'lodash';
import type { Reducer, UnknownAction } from 'redux';
import { DEFAULT_SHADOW_COLOR } from '@shopgate/engage/styles/theme/createTheme/shadows';
import type { AppSettingsSlice, ShadowSettings } from '../types/appSettings';
import type { ReceiveAppSettingsAction } from '../action-creators/appSettings';
import { RECEIVE_APP_SETTINGS } from '../constants/appSettings';

type AppSettingsAction = ReceiveAppSettingsAction | UnknownAction;

const isReceiveAppSettingsAction = (
  action: AppSettingsAction
): action is ReceiveAppSettingsAction => (
  action.type === RECEIVE_APP_SETTINGS && 'settings' in action
);

/**
 * The default shadow of the configurable surfaces. `none` because the admin only sends a size
 * when the shadow style is selected — the fields are hidden for the border and flat styles, and a
 * hidden field is pruned from the payload, so an elevation here would show up on a flat card.
 */
const DEFAULT_SHADOW: ShadowSettings = {
  size: 'none',
  color: DEFAULT_SHADOW_COLOR,
};

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
    },
  },
  productList: {
    grid: {
      columns: {
        xs: 2,
        md: 4,
      },
    },
    card: {
      productName: { lines: 3 },
      shadow: { ...DEFAULT_SHADOW },
    },
    tile: {
      productName: { lines: 3 },
      shadow: { ...DEFAULT_SHADOW },
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
) => {
  if (isReceiveAppSettingsAction(action)) {
    // Merged over the defaults rather than over the current state, so a field an incoming payload
    // omits falls back to its default instead of keeping the value of an earlier one. The admin
    // preview needs that: it stops sending a shadow size once the card style isn't `shadow`.
    return merge({}, DEFAULT_APP_SETTINGS, action.settings, { isHydrated: true });
  }

  return state ?? DEFAULT_APP_SETTINGS;
};

export default appSettings;
