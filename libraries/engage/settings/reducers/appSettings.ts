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
    // Already in the image service's format, so the unhydrated path needs no conversion.
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
    const { images } = action.settings ?? {};

    // Deep merged so a partial payload keeps the defaults for whatever the source omits. A cleared
    // branch is substituted first - merge assigns a null, where it would skip an undefined.
    merge(draft, {
      ...action.settings,
      images: {
        ...images,
        product: images?.product ?? DEFAULT_APP_SETTINGS.images.product,
      },
    });

    // Converted on the way in, so the slice holds wire ready values and every image url does not
    // pay for it. Unconditional, because an empty string or a null reaches here like any other
    // value - both converters are idempotent.
    draft.images.fillColor = toThumborColor(draft.images.fillColor);
    draft.images.quality = toImageQuality(draft.images.quality);

    draft.isHydrated = true;
  }
});

export default appSettings;
