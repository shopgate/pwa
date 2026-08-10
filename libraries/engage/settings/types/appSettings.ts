import type { Breakpoint, ShadowSize } from '@shopgate/engage/styles/theme';

// Re-exported so consumers of these settings do not have to reach into the styles layer, which
// owns the type because it owns the elevation scale the sizes map to.
export type { ShadowSize };

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
 * Number of product columns to render, keyed by breakpoint. Partial: any unset
 * breakpoint cascades down to the next smaller defined value (see
 * useResponsiveValue).
 */
export type ProductColumns = Partial<Record<Breakpoint, number>>;

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
 * Drop shadow shared by the card and tile product surfaces.
 */
export interface ShadowSettings {
  /** Which preset elevation to draw. `none` renders no shadow at all. */
  size: ShadowSize;
}

/**
 * Settings for the various product-list types. Add a key and its own settings
 * interface per future type (e.g. slider).
 */
export interface ProductListSettings {
  grid: ProductGridSettings;
  /** Product cards (sliders, relations, live shopping). */
  card: { productName: ProductNameSettings };
  /** Product grid tiles. */
  tile: { productName: ProductNameSettings; shadow: ShadowSettings };
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
    }
  }
  productList: ProductListSettings;
  /**
   * Settings for images that are served through the image service.
   */
  images: ImageSettings;
  cards: CardSettings;
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
