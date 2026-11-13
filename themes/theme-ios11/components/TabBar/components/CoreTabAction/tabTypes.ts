import type { ComponentType, ReactNode } from 'react';
import { INDEX_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import { FAVORITES_PATH } from '@shopgate/pwa-common-commerce/favorites/constants';
import HomeIcon from '@shopgate/pwa-ui-ios/icons/HomeIcon';
import CartIcon from '@shopgate/pwa-ui-ios/icons/CartIcon';
import BrowseIcon from '@shopgate/pwa-ui-shared/icons/BrowseIcon';
import HeartIcon from '@shopgate/pwa-ui-shared/icons/HeartIcon';
import MoreIcon from '@shopgate/pwa-ui-shared/icons/MoreIcon';
import { BROWSE_PATH } from 'Pages/Browse/constants';
import { MORE_PATH } from 'Pages/More/constants';
import {
  TAB_HOME,
  TAB_BROWSE,
  TAB_CART,
  TAB_FAVORITES,
  TAB_MORE,
  TAB_BAR_HOME_BEFORE,
  TAB_BAR_HOME,
  TAB_BAR_HOME_AFTER,
  TAB_BAR_HOME_ICON,
  TAB_BAR_BROWSE_BEFORE,
  TAB_BAR_BROWSE,
  TAB_BAR_BROWSE_AFTER,
  TAB_BAR_BROWSE_ICON,
  TAB_BAR_CART_BEFORE,
  TAB_BAR_CART,
  TAB_BAR_CART_AFTER,
  TAB_BAR_CART_ICON,
  TAB_BAR_FAVORITES_BEFORE,
  TAB_BAR_FAVORITES,
  TAB_BAR_FAVORITES_AFTER,
  TAB_BAR_FAVORITES_ICON,
  TAB_BAR_MORE_BEFORE,
  TAB_BAR_MORE,
  TAB_BAR_MORE_AFTER,
  TAB_BAR_MORE_ICON,
} from '../../constants';
import { useCartTabExtras, useFavoritesTabExtras } from './hooks';

/**
 * What a tab type adds to the common tab: portal props, aria label and badge.
 */
export interface TabExtras {
  /**
   * Props the tab portals get in addition to the tab props. They don't reach `TabBarAction`.
   */
  portalProps: Record<string, unknown>;
  /**
   * Replaces the `aria-label` of the tab.
   */
  ariaLabel?: string;
  /**
   * Rendered after the label of the tab.
   */
  badge?: ReactNode;
}

/**
 * The legacy portals of a tab type.
 */
interface TabPortals {
  /**
   * Rendered before the tab.
   */
  before: string;
  /**
   * Wraps the tab.
   */
  main: string;
  /**
   * Rendered after the tab.
   */
  after: string;
  /**
   * Wraps the icon of the tab.
   */
  icon: string;
}

/**
 * How one core tab type behaves.
 */
interface CoreTabType {
  /**
   * Name of the tab component in React DevTools and component stacks.
   */
  displayName: string;
  /**
   * The path a click opens.
   */
  path: string;
  /**
   * The icon shown without a configured icon.
   */
  icon: ComponentType<{
    /**
     * Sets the size of the icon.
     */
    className?: string;
  }>;
  /**
   * Width of the default icon in pixels.
   */
  iconWidth: number;
  /**
   * Height of the default icon in pixels.
   */
  iconHeight: number;
  /**
   * The legacy portals of the tab.
   */
  portals: TabPortals;
  /**
   * Provides the additions of the tab type.
   */
  useExtras?: (label: string) => TabExtras;
  /**
   * Whether the before portal gets the props without `TabBarAction`, as the cart tab always did.
   */
  beforeWithoutTabBarAction?: boolean;
}

/**
 * The type names of the core tabs.
 */
export type CoreTabTypeName =
  | typeof TAB_HOME
  | typeof TAB_BROWSE
  | typeof TAB_CART
  | typeof TAB_FAVORITES
  | typeof TAB_MORE;

export const CORE_TABS: Readonly<Record<CoreTabTypeName, CoreTabType>> = {
  [TAB_HOME]: {
    displayName: 'TabBarHomeAction',
    path: INDEX_PATH,
    icon: HomeIcon,
    iconWidth: 24,
    iconHeight: 24,
    portals: {
      before: TAB_BAR_HOME_BEFORE,
      main: TAB_BAR_HOME,
      after: TAB_BAR_HOME_AFTER,
      icon: TAB_BAR_HOME_ICON,
    },
  },
  [TAB_BROWSE]: {
    displayName: 'TabBarBrowseAction',
    path: BROWSE_PATH,
    icon: BrowseIcon,
    iconWidth: 31,
    iconHeight: 32,
    portals: {
      before: TAB_BAR_BROWSE_BEFORE,
      main: TAB_BAR_BROWSE,
      after: TAB_BAR_BROWSE_AFTER,
      icon: TAB_BAR_BROWSE_ICON,
    },
  },
  [TAB_CART]: {
    displayName: 'TabBarCartAction',
    path: CART_PATH,
    icon: CartIcon,
    iconWidth: 24,
    iconHeight: 24,
    portals: {
      before: TAB_BAR_CART_BEFORE,
      main: TAB_BAR_CART,
      after: TAB_BAR_CART_AFTER,
      icon: TAB_BAR_CART_ICON,
    },
    useExtras: useCartTabExtras,
    beforeWithoutTabBarAction: true,
  },
  [TAB_FAVORITES]: {
    displayName: 'TabBarFavoritesAction',
    path: FAVORITES_PATH,
    icon: HeartIcon,
    iconWidth: 24,
    iconHeight: 24,
    portals: {
      before: TAB_BAR_FAVORITES_BEFORE,
      main: TAB_BAR_FAVORITES,
      after: TAB_BAR_FAVORITES_AFTER,
      icon: TAB_BAR_FAVORITES_ICON,
    },
    useExtras: useFavoritesTabExtras,
  },
  [TAB_MORE]: {
    displayName: 'TabBarMoreAction',
    path: MORE_PATH,
    icon: MoreIcon,
    iconWidth: 24,
    iconHeight: 24,
    portals: {
      before: TAB_BAR_MORE_BEFORE,
      main: TAB_BAR_MORE,
      after: TAB_BAR_MORE_AFTER,
      icon: TAB_BAR_MORE_ICON,
    },
  },
};
