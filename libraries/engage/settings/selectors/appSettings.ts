import { createSelector } from 'reselect';
import { COLOR_SCHEME_SELECTABLE } from '../types/appSettings';
import type { AppSettingsSlice, AppSettingsState, ColorSchemeMode } from '../types/appSettings';
import { DEFAULT_APP_SETTINGS } from '../reducers/appSettings';

/**
 * Retrieves the appSettings state from the store. Falls back to the built-in
 * defaults when the slice is not present in the store yet.
 * @param state The current application state.
 * @returns The appSettings state.
 */
export const getAppSettingsState = (state: AppSettingsState): AppSettingsSlice =>
  state?.settings?.appSettings ?? DEFAULT_APP_SETTINGS;

/**
 * Selects whether the app settings have been hydrated from a source
 * (admin sync / jsonp). While `false` the values are the built-in defaults,
 * so consumers should not rely on them and can fall back to the legacy
 * settings system.
 */
export const getAreAppSettingsHydrated = createSelector(
  getAppSettingsState,
  appSettings => appSettings.isHydrated
);

/**
 * Selects the tab bar settings.
 */
export const getTabBarSettings = createSelector(
  getAppSettingsState,
  appSettings => appSettings.navigation.tabBar
);

/**
 * Selects the ProductGrid columns setting (keyed by breakpoint).
 */
export const getProductGridColumns = createSelector(
  getAppSettingsState,
  appSettings => appSettings.product.grid.columns
);

/**
 * Selects the ProductSlider slidesPerView setting (keyed by breakpoint).
 */
export const getProductSliderSlidesPerView = createSelector(
  getAppSettingsState,
  appSettings => appSettings.product.slider.slidesPerView
);

/**
 * Selects whether the favorites tab bar icon shows the number of favorites within its badge.
 */
export const getShowFavoritesCounter = createSelector(
  getAppSettingsState,
  appSettings => appSettings.navigation.tabBar.favorites.showCounter
);

/**
 * Selects whether rating stars are also shown for products without a rating.
 */
export const getShowEmptyRatingStars = createSelector(
  getAppSettingsState,
  appSettings => appSettings.product.rating.showEmptyStars
);

/**
 * Selects the image settings.
 */
export const getImageSettings = createSelector(
  getAppSettingsState,
  appSettings => appSettings.images
);

/**
 * Selects the max number of lines a product card name is clamped to.
 */
export const getProductCardNameMaxLines = createSelector(
  getAppSettingsState,
  appSettings => appSettings.product.card.productName.maxLines
);

/**
 * Selects the max number of lines a product tile name is clamped to.
 */
export const getProductTileNameMaxLines = createSelector(
  getAppSettingsState,
  appSettings => appSettings.product.tile.productName.maxLines
);

/**
 * Selects the themed card settings (style and shadow size).
 */
export const getCardSettings = createSelector(
  getAppSettingsState,
  appSettings => appSettings.cards
);

/**
 * Selects the effective card shadow size. `none` unless the shadow style is selected.
 */
export const getCardShadowSize = createSelector(
  getCardSettings,
  cards => (cards.style === 'shadow' ? cards.shadow.size : 'none')
);

/**
 * Selects the default margins of the widget containers.
 */
export const getWidgetLayoutSettings = createSelector(
  getAppSettingsState,
  appSettings => appSettings.widgets?.layout ?? DEFAULT_APP_SETTINGS.widgets.layout
);

/**
 * Selects the raw appearance setting: a binding color scheme, or `selectable`.
 */
const getConfiguredColorSchemeMode = createSelector(
  getAppSettingsState,
  appSettings => appSettings.appearance?.defaultColorSchemeMode
    ?? DEFAULT_APP_SETTINGS.appearance.defaultColorSchemeMode
);

/**
 * Selects the color scheme mode that applies while the visitor has no own preference stored. A
 * mode rather than a scheme name, since it can also ask to follow the operating system: a
 * `selectable` setting starts there, so the theme layer only ever sees its own vocabulary.
 */
export const getDefaultColorSchemeMode = createSelector(
  getConfiguredColorSchemeMode,
  (configured): ColorSchemeMode =>
    (configured === COLOR_SCHEME_SELECTABLE ? 'system' : configured)
);

/**
 * Selects whether visitors may pick a color scheme themselves. False while a binding `light` or
 * `dark` is configured, in which case a stored pick of theirs does not apply.
 */
export const getCanSelectColorScheme = createSelector(
  getConfiguredColorSchemeMode,
  configured => configured === COLOR_SCHEME_SELECTABLE
);

/**
 * Selects the typography settings.
 */
export const getTypographySettings = createSelector(
  getAppSettingsState,
  appSettings => appSettings.typography
);

/**
 * Selects the font stylesheets to load, global file first and without duplicates.
 */
export const getTypographyFontCssUrls = createSelector(
  getTypographySettings,
  typography => Array.from(new Set([
    typography.fontCssUrl,
    ...Object.values(typography.variants).map(variant => variant?.fontCssUrl),
  ].filter((url): url is string => typeof url === 'string' && url.length > 0)))
);
