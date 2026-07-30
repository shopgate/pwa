import { produce } from 'immer';
import { merge } from 'lodash';
import type { Reducer, UnknownAction } from 'redux';
import type { AppSettingsSlice } from '../types/appSettings';
import type { ReceiveAppSettingsAction } from '../action-creators/appSettings';
import { RECEIVE_APP_SETTINGS } from '../constants/appSettings';
import {
  DEFAULT_IMAGE_FILL_COLOR,
  DEFAULT_IMAGE_FILL_TRANSPARENT,
  DEFAULT_IMAGE_QUALITY,
  DEFAULT_SHOW_INNER_SHADOW,
} from '../constants/imageSettings';
// Deliberately not exported from the "helpers" barrel - they normalize values on their way into
// the slice, which is nothing a consumer of the settings needs.
import { toImageQuality } from '../helpers/toImageQuality';
import { toThumborColor } from '../helpers/toThumborColor';

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
    },
  },
  productList: {
    grid: {
      columns: {
        xs: 2,
        md: 4,
      },
    },
  },
  images: {
    quality: DEFAULT_IMAGE_QUALITY,
    // Already in the image service's expected format, so the unhydrated path needs no conversion.
    fillColor: DEFAULT_IMAGE_FILL_COLOR,
    fillTransparent: DEFAULT_IMAGE_FILL_TRANSPARENT,
    product: {
      ratio: {
        width: 1,
        height: 1,
      },
      showInnerShadow: DEFAULT_SHOW_INNER_SHADOW,
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

    // The image service values reach redux exactly as the source sent them - the fill color as any
    // CSS color, the quality possibly as a half typed number from an admin field. Converting here
    // rather than on read keeps the slice wire ready, and runs the conversion once per settings
    // change instead of on every render.
    //
    // Unconditional rather than guarded on what the payload carried: merge overwrites with an empty
    // string or a null, which would otherwise reach the url unconverted. Both converters are
    // idempotent, so re-converting is a no-op.
    draft.images.fillColor = toThumborColor(draft.images.fillColor);
    draft.images.quality = toImageQuality(draft.images.quality);

    draft.isHydrated = true;
  }
});

export default appSettings;
