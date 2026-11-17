import type { NavigationActionSettings } from './types';

/**
 * UI event that opens the search overlay.
 */
export const OPEN_SEARCH = 'navigation.openSearch';

/**
 * UI event that opens the category drawer. The payload may name the category to start at.
 */
export const OPEN_CATEGORY_DRAWER = 'navigation.openCategoryDrawer';

/**
 * The category overview page.
 */
export const BROWSE_PATH = '/browse';

/**
 * The more page with the merchant's menu entries.
 */
export const MORE_PATH = '/more';

/**
 * The most items the tab bar renders.
 */
export const TAB_BAR_MAX_ITEMS = 6;

/**
 * Counts above this are shown as `{max}+` while an action sets no `badgeMax`.
 */
export const DEFAULT_NAVIGATION_BADGE_MAX = 99;

/**
 * The tab bar items while the merchant configured none. Frozen, since every importer shares
 * them.
 */
export const DEFAULT_TAB_BAR_ITEMS: readonly Readonly<NavigationActionSettings>[] = Object.freeze([
  'home',
  'browse',
  'cart',
  'favorites',
  'more',
].map(action => Object.freeze({
  action,
  icon: '',
  link: '',
})));
