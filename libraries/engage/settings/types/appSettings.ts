import type {
  ColorSchemeMode, ColorSchemeName, ShadowSize, TypographyVariant,
} from '@shopgate/engage/styles/theme';

// Re-exported so consumers of these settings do not have to reach into the styles layer, which
// owns the type because it owns the elevation scale the sizes map to. `TypographyVariant` and the
// color scheme types are reused for the same reason - the theme owns the variant and scheme lists.
export type {
  ColorSchemeMode, ColorSchemeName, ShadowSize, TypographyVariant,
};

/**
 * Recursively optional variant of `T`. The settings sources send only what a merchant configured,
 * and the admin preview additionally prunes the fields its visibility conditions hide.
 */
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export interface AppSettingsState {
  settings: {
    appSettings: AppSettingsSlice;
  };
}

/**
 * The merchant-facing screen sizes for the product list types. Each maps to a theme
 * breakpoint inside the consuming hook (small → xs, medium → sm, large → md).
 */
export type ScreenSize = 'small' | 'medium' | 'large';

/**
 * A value keyed by screen size. Partial: any unset size cascades down to the next smaller
 * defined value (see useResponsiveValue).
 */
export type PerScreenSize = Partial<Record<ScreenSize, number>>;

/**
 * Number of product columns to render, keyed by screen size.
 */
export type ProductColumns = PerScreenSize;

/**
 * Settings for the ProductGrid list type.
 */
export interface ProductGridSettings {
  columns: ProductColumns;
}

/**
 * Name-clamping shared by the card and tile product surfaces.
 */
export interface ProductNameSettings {
  /** Max number of lines the product name is clamped to before an ellipsis. */
  maxLines: number;
}

/**
 * Drop shadow of the card surface.
 */
export interface ShadowSettings {
  /** Which preset elevation to draw. `none` renders no shadow at all. */
  size: ShadowSize;
}

/**
 * Number of slides to render side by side, keyed by screen size. Fractional values are allowed.
 */
export type SlidesPerView = PerScreenSize;

/**
 * Settings for the ProductSlider list type.
 */
export interface ProductSliderSettings {
  slidesPerView: SlidesPerView;
}

/**
 * Settings for the product rating stars.
 */
export interface ProductRatingSettings {
  /**
   * Whether rating stars are also rendered for products that have no rating yet.
   */
  showEmptyStars: boolean;
}

/**
 * Settings for product presentation across the app.
 */
export interface ProductSettings {
  grid: ProductGridSettings;
  slider: ProductSliderSettings;
  rating: ProductRatingSettings;
  /** Product cards (sliders, relations, live shopping). */
  card: { productName: ProductNameSettings };
  /** Product grid tiles. */
  tile: { productName: ProductNameSettings };
}

/**
 * The visual style of the card surface.
 */
export type CardStyle = 'shadow' | 'border' | 'flat';

/**
 * Settings for the themed card surface (checkout sections, address cards, sliders).
 */
export interface CardSettings {
  style: CardStyle;
  shadow: ShadowSettings;
}

/**
 * An aspect ratio expressed as width and height parts. Only the proportion matters -
 * { width: 4, height: 5 } and { width: 8, height: 10 } are equivalent.
 */
export interface AspectRatio {
  /**
   * The width part of the proportion.
   */
  width: number;
  /**
   * The height part of the proportion.
   */
  height: number;
}

/**
 * A single image resolution requested from the image service.
 */
export interface ImageResolution {
  /**
   * Width in pixels.
   */
  width: number;
  /**
   * Height in pixels, derived from the configured aspect ratio.
   */
  height: number;
}

/**
 * The product image contexts. pdp drives the product detail page, gallery the fullscreen gallery,
 * and list every grid, slider, list and row tile.
 */
export type ProductImageContext = 'pdp' | 'gallery' | 'list';

/**
 * Settings for a single product image context. The pixel dimensions are not configurable - they
 * are derived from the built-in base widths for the context (see PRODUCT_IMAGE_BASE_WIDTHS) so
 * that image weight stays under the theme's control.
 */
export interface ProductImageContextSettings {
  /**
   * The aspect ratio images in this context are rendered at.
   */
  ratio: AspectRatio;
}

/**
 * Settings for the product image contexts.
 */
export interface ProductImageSettings {
  /**
   * The aspect ratio applied to every context that does not override it.
   */
  ratio: AspectRatio;
  /**
   * Whether product images get an inset shadow. Applies to the image and to the placeholder that
   * stands in for it, so both keep the same silhouette.
   */
  showInnerShadow: boolean;
  /**
   * Overrides for the product detail page.
   */
  pdp?: ProductImageContextSettings;
  /**
   * Overrides for the fullscreen gallery.
   */
  gallery?: ProductImageContextSettings;
  /**
   * Overrides for grid, slider, list and row tiles.
   */
  list?: ProductImageContextSettings;
}

/**
 * Settings for images that are served through the image service.
 *
 * quality, fillColor and fillTransparent sit here rather than under product because they are not
 * product specific - getFullImageSource applies them to every image that goes through the image
 * service, including category images, carrier logos and page builder widget images.
 */
export interface ImageSettings {
  /**
   * Compression quality passed to the image service, 1 to 100.
   */
  quality: number;
  /**
   * The color the image service fills letterboxed areas with. A source may send any CSS color -
   * named, hex 3/6/8, rgb(), rgba(), hsl() - or one of Thumbor's own keywords: 'auto', 'blur',
   * 'transparent'. The value reaches the store untouched and the reducer converts it into a
   * Thumbor color token, so everything reading this field gets a wire-ready value.
   */
  fillColor: string;
  /**
   * Thumbor's fill_transparent argument - whether transparent areas of the source image are
   * filled too. True is what the legacy 'FFFFFF,1' config expressed.
   */
  fillTransparent: boolean;
  /**
   * Aspect ratios for the product image contexts.
   */
  product: ProductImageSettings;
}

/**
 * Settings for the app's overall appearance.
 */
export interface AppearanceSettings {
  /**
   * The color scheme mode the app starts in. A visitor who picked one themselves keeps their
   * choice - this one only applies while no such preference is stored.
   */
  defaultColorSchemeMode: ColorSchemeMode;
}

export interface AppSettings {
  navigation: {
    tabBar: {
      variant: 'fixed' | 'floating'
      transition: 'fade' | 'slide';
      showLabels: boolean;
      hideOnScroll: boolean;
      fixed: {
        borderEnabled: boolean;
      }
      favorites: {
        /**
         * Whether the favorites tab bar icon renders the number of favorites within its badge.
         */
        showCounter: boolean;
      }
    }
  }
  product: ProductSettings;
  /**
   * Settings for images that are served through the image service.
   */
  images: ImageSettings;
  cards: CardSettings;
  typography: TypographySettings;
  appearance: AppearanceSettings;
}

/**
 * A font stylesheet to load. The file carries the `@font-face` rules and points its target at the
 * new family itself, e.g. `:root { --sg-typography-h1-fontFamily: 'Recoleta'; }`.
 */
export interface FontCssSettings {
  /**
   * Absolute url of the stylesheet.
   */
  fontCssUrl?: string;
}

/**
 * Typography settings. The top level file applies to everything, a variant entry only to that
 * variant. Variant files are loaded after the global one, so they win at equal specificity.
 */
export interface TypographySettings extends FontCssSettings {
  /**
   * Per variant font stylesheets, keyed by typography variant.
   */
  variants: Partial<Record<TypographyVariant, FontCssSettings>>;
}

/**
 * What a settings source actually sends. Every field is optional, so the reducer fills the gaps
 * from its defaults instead of leaving consumers with undefined.
 */
export type AppSettingsPayload = DeepPartial<AppSettings>;

/**
 * The stored app settings slice. Extends the raw {@link AppSettings} values
 * with metadata that is derived by the reducer rather than supplied by a
 * source (admin sync / jsonp).
 */
export interface AppSettingsSlice extends AppSettings {
  /**
   * Whether the settings have been hydrated from a source (admin sync / jsonp).
   * While `false` the values are the built-in defaults and should be treated as
   * unreliable, so consumers can fall back to the legacy settings system.
   */
  isHydrated: boolean;
}
