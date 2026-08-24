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
      favorites: {
        showCounter: true,
      },
    },
  },
  product: {
    grid: {
      columns: {
        small: 2,
        large: 4,
      },
    },
    slider: {
      slidesPerView: {
        small: 2.3,
        medium: 3.3,
        large: 4.3,
      },
    },
    rating: {
      showEmptyStars: true,
    },
    card: {
      productName: { maxLines: 3 },
    },
    tile: {
      productName: { maxLines: 3 },
    },
  },
  cards: {
    style: 'shadow',
    shadow: { size: 'medium' },
  },
  typography: {
    variants: {},
  },
  appearance: {
    defaultColorSchemeMode: 'light',
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
) => {
  if (isReceiveAppSettingsAction(action)) {
    const { images, typography, appearance } = action.settings ?? {};

    // Merged over the defaults rather than over the current state, so a field an incoming payload
    // omits falls back to its default instead of keeping the value of an earlier one. The admin
    // preview needs that: it stops sending a shadow size once the card style isn't `shadow`, and it
    // clears a whole branch by sending a null.
    const nextState: AppSettingsSlice = merge({}, DEFAULT_APP_SETTINGS, {
      ...action.settings,
      // A cleared branch is mapped to undefined, which merge skips, so the defaults it started from
      // stay in place. A null would be written into the slice like any other value.
      images: images === null ? undefined : {
        ...images,
        product: images?.product ?? undefined,
      },
      typography: typography === null ? undefined : {
        ...typography,
        variants: typography?.variants ?? undefined,
      },
      appearance: appearance === null ? undefined : {
        ...appearance,
        defaultColorSchemeMode: appearance?.defaultColorSchemeMode ?? undefined,
      },
    }, { isHydrated: true });

    // Converted on the way in, so the slice holds wire ready values and every image url does not
    // pay for it. Unconditional, because an empty string or a null reaches here like any other
    // value - both converters are idempotent.
    nextState.images.fillColor = toThumborColor(nextState.images.fillColor);
    nextState.images.quality = toImageQuality(nextState.images.quality);

    return nextState;
  }

  return state ?? DEFAULT_APP_SETTINGS;
};

export default appSettings;
