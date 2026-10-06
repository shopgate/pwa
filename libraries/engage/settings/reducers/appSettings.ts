import {
  isNil, isPlainObject, mapValues, merge, omitBy,
} from 'lodash';
import type { Reducer, UnknownAction } from 'redux';
import type {
  AppSettingsSlice,
  CartPaymentBarSettings,
  ProductActionButtonsSettings,
  ProductAddToCartBarSettings,
  ProductVariantSelectorSettings,
} from '../types/appSettings';
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
import { pickValidSettings } from '../helpers/pickValidSettings';
import { toImageQuality } from '../helpers/toImageQuality';
import { toThumborColor } from '../helpers/toThumborColor';

type AppSettingsAction = ReceiveAppSettingsAction | UnknownAction;

const isReceiveAppSettingsAction = (
  action: AppSettingsAction
): action is ReceiveAppSettingsAction => (
  action.type === RECEIVE_APP_SETTINGS && 'settings' in action
);

const VARIANT_SELECTOR_OPTIONS: {
  [K in keyof ProductVariantSelectorSettings]?: readonly ProductVariantSelectorSettings[K][]
} = {
  type: ['dropdown', 'chips'],
  swatchSource: ['variantImage', 'property'],
  swatchShape: ['round', 'square'],
  chipsLayout: ['wrap', 'scroll'],
  soldOut: ['strike', 'hide', 'none'],
};

const ACTION_BUTTON_OPTIONS: {
  [K in keyof ProductActionButtonsSettings]?: readonly ProductActionButtonsSettings[K][]
} = {
  position: ['topRight', 'bottomRight'],
  addToCart: ['hidden', 'actionButton', 'button'],
  direction: ['horizontal', 'vertical'],
};

const ADD_TO_CART_BAR_OPTIONS: {
  [K in keyof ProductAddToCartBarSettings]?: readonly ProductAddToCartBarSettings[K][]
} = {
  variant: ['fixed', 'floating'],
};

const PAYMENT_BAR_OPTIONS: {
  [K in keyof CartPaymentBarSettings]?: readonly CartPaymentBarSettings[K][]
} = {
  variant: ['fixed', 'floating'],
};

/**
 * The built-in default app settings. Used as the reducer's initial state and as
 * a safe fallback for selectors when the slice is not present in the store yet.
 */
export const DEFAULT_APP_SETTINGS: AppSettingsSlice = {
  isHydrated: false,
  navigation: {
    appBar: {
      style: 'classic',
      logoPosition: 'center',
      buttons: {
        left1: {
          action: 'none',
          icon: '',
          link: '',
        },
        left2: {
          action: 'none',
          icon: '',
          link: '',
        },
        right1: {
          action: 'none',
          icon: '',
          link: '',
        },
        right2: {
          action: 'none',
          icon: '',
          link: '',
        },
      },
      modern: {
        scrollBehavior: 'revealBar',
      },
    },
    search: {
      persistentBar: {
        home: false,
        category: false,
        search: true,
        product: false,
        page: false,
        favorites: false,
        hideOnScroll: true,
      },
    },
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
      showEmptyStars: false,
    },
    card: {
      productName: { maxLines: 3 },
    },
    tile: {
      productName: { maxLines: 3 },
    },
    variantSelector: {
      type: 'dropdown',
      swatchesEnabled: false,
      swatchCharacteristics: 'Farbe, Color',
      swatchSource: 'variantImage',
      swatchShape: 'round',
      swatchImageZoom: 100,
      swatchProperty: '',
      chipsLayout: 'wrap',
      preselect: false,
      soldOut: 'strike',
    },
    actionButtons: {
      position: 'bottomRight',
      addToCart: 'hidden',
      direction: 'horizontal',
      showShareButton: true,
    },
    addToCartBar: {
      variant: 'fixed',
      quantityPicker: false,
    },
  },
  cart: {
    paymentBar: {
      variant: 'fixed',
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
  widgets: {
    mediaMargins: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
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
) => {
  if (isReceiveAppSettingsAction(action)) {
    const {
      images, typography, appearance, widgets, product, cart, navigation,
    } = action.settings ?? {};
    const { mediaMargins } = widgets ?? {};

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
      navigation: navigation === null ? undefined : {
        ...navigation,
        appBar: navigation?.appBar ? {
          ...omitBy(navigation.appBar, isNil),
          buttons: navigation.appBar.buttons
            ? mapValues(omitBy(navigation.appBar.buttons, isNil), entry => omitBy(entry, isNil))
            : undefined,
          modern: navigation.appBar.modern
            ? omitBy(navigation.appBar.modern, isNil)
            : undefined,
        } : undefined,
        search: navigation?.search?.persistentBar ? {
          persistentBar: omitBy(navigation.search.persistentBar, isNil),
        } : undefined,
        tabBar: navigation?.tabBar ? {
          ...omitBy(navigation.tabBar, isNil),
          fixed: navigation.tabBar.fixed ? omitBy(navigation.tabBar.fixed, isNil) : undefined,
          favorites: navigation.tabBar.favorites
            ? omitBy(navigation.tabBar.favorites, isNil)
            : undefined,
        } : undefined,
      },
      product: product === null ? undefined : {
        ...product,
        variantSelector: pickValidSettings(
          product?.variantSelector,
          DEFAULT_APP_SETTINGS.product.variantSelector,
          VARIANT_SELECTOR_OPTIONS
        ),
        actionButtons: pickValidSettings(
          product?.actionButtons,
          DEFAULT_APP_SETTINGS.product.actionButtons,
          ACTION_BUTTON_OPTIONS
        ),
        addToCartBar: pickValidSettings(
          product?.addToCartBar,
          DEFAULT_APP_SETTINGS.product.addToCartBar,
          ADD_TO_CART_BAR_OPTIONS
        ),
      },
      cart: !isPlainObject(cart) ? undefined : {
        ...cart,
        paymentBar: pickValidSettings(
          cart?.paymentBar,
          DEFAULT_APP_SETTINGS.cart.paymentBar,
          PAYMENT_BAR_OPTIONS
        ),
      },
      widgets: widgets === null ? undefined : {
        ...widgets,
        // Sides are mapped one by one, because the admin clears a single margin with a null just
        // like it clears a whole branch with one.
        mediaMargins: !mediaMargins ? undefined : {
          top: mediaMargins.top ?? undefined,
          bottom: mediaMargins.bottom ?? undefined,
          left: mediaMargins.left ?? undefined,
          right: mediaMargins.right ?? undefined,
        },
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
