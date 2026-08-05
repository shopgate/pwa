import type { Breakpoint } from '@shopgate/engage/styles/theme';

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
 * Settings for the various product-list types. Add a key and its own settings
 * interface per future type (e.g. slider).
 */
export interface ProductListSettings {
  grid: ProductGridSettings;
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
  rating: ProductRatingSettings;
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
  productList: ProductListSettings;
  product: ProductSettings;
}

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
