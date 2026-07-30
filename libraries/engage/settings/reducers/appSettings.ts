import { produce } from 'immer';
import { merge } from 'lodash';
import type { Reducer, UnknownAction } from 'redux';
import type { AppSettingsSlice } from '../types/appSettings';
import type { ReceiveAppSettingsAction } from '../action-creators/appSettings';
import { RECEIVE_APP_SETTINGS } from '../constants/appSettings';
import {
  DEFAULT_IMAGE_FILL_COLOR,
  DEFAULT_IMAGE_FILL_TRANSPARENT,
} from '../constants/imageSettings';
import { toThumborColor } from '../helpers';

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
    // Already in the image service's expected format, so the unhydrated path needs no conversion.
    fillColor: DEFAULT_IMAGE_FILL_COLOR,
    fillTransparent: DEFAULT_IMAGE_FILL_TRANSPARENT,
    product: {
      ratio: {
        width: 1,
        height: 1,
      },
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

    // The fill color reaches redux exactly as the source sent it - any CSS color, or one of the
    // image service's own keywords. It is converted here rather than on read, so the slice holds a
    // wire ready value and the conversion runs once per settings change instead of on every render.
    //
    // Converted unconditionally rather than only when the payload carried one: merge overwrites
    // with an empty string or a null, so guarding on the incoming value would let those through
    // unconverted and produce a malformed "fill=" parameter. toThumborColor is idempotent, so
    // re-converting an already converted value is a no-op.
    draft.images.fillColor = toThumborColor(draft.images.fillColor);

    draft.isHydrated = true;
  }
});

export default appSettings;
