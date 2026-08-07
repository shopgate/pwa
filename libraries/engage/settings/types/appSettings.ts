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
  card: { productName: ProductNameSettings; shadow: ShadowSettings };
  /** Product grid tiles. */
  tile: { productName: ProductNameSettings; shadow: ShadowSettings };
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
