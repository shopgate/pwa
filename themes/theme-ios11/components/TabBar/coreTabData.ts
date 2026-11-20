import { INDEX_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import { FAVORITES_PATH } from '@shopgate/pwa-common-commerce/favorites/constants';
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
} from './constants';

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
 * The plain data of one core tab type, without components. Light enough for selectors and
 * subscriptions.
 */
export interface CoreTabData {
  /**
   * Name of the tab component in React DevTools and component stacks.
   */
  displayName: string;
  /**
   * The path a click opens. It's also the root path of the tab.
   */
  path: string;
  /**
   * I18n key of the tab label.
   */
  label: string;
  /**
   * The legacy portals of the tab.
   */
  portals: TabPortals;
}

/**
 * The type names of the core tabs. Each equals the core action of the same name.
 */
export type CoreTabTypeName =
  | typeof TAB_HOME
  | typeof TAB_BROWSE
  | typeof TAB_CART
  | typeof TAB_FAVORITES
  | typeof TAB_MORE;

export const CORE_TAB_DATA: Readonly<Record<CoreTabTypeName, CoreTabData>> = {
  [TAB_HOME]: {
    displayName: 'TabBarHomeAction',
    path: INDEX_PATH,
    label: 'tab_bar.home',
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
    label: 'tab_bar.browse',
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
    label: 'tab_bar.cart',
    portals: {
      before: TAB_BAR_CART_BEFORE,
      main: TAB_BAR_CART,
      after: TAB_BAR_CART_AFTER,
      icon: TAB_BAR_CART_ICON,
    },
  },
  [TAB_FAVORITES]: {
    displayName: 'TabBarFavoritesAction',
    path: FAVORITES_PATH,
    label: 'tab_bar.favorites',
    portals: {
      before: TAB_BAR_FAVORITES_BEFORE,
      main: TAB_BAR_FAVORITES,
      after: TAB_BAR_FAVORITES_AFTER,
      icon: TAB_BAR_FAVORITES_ICON,
    },
  },
  [TAB_MORE]: {
    displayName: 'TabBarMoreAction',
    path: MORE_PATH,
    label: 'tab_bar.more',
    portals: {
      before: TAB_BAR_MORE_BEFORE,
      main: TAB_BAR_MORE,
      after: TAB_BAR_MORE_AFTER,
      icon: TAB_BAR_MORE_ICON,
    },
  },
};

/**
 * The tab types in the order of the legacy tab bar.
 */
export const CORE_TAB_TYPES = Object.keys(CORE_TAB_DATA) as CoreTabTypeName[];

/**
 * Checks whether a name is the type of a core tab.
 * @param name The name to check.
 * @returns Whether it's a core tab type.
 */
export const isCoreTabType = (name: string): name is CoreTabTypeName => (
  Object.prototype.hasOwnProperty.call(CORE_TAB_DATA, name)
);

const CORE_TAB_TYPE_ALIASES: Readonly<Record<string, CoreTabTypeName>> = {
  categoryDrawer: TAB_BROWSE,
};

/**
 * Looks up the core tab type of an action. Each core tab type equals the core action of the same
 * name, the category drawer shares the Browse tab.
 * @param action The configured action.
 * @returns The tab type, or undefined when the action is no core tab.
 */
export const getCoreTabType = (action: string): CoreTabTypeName | undefined => {
  if (isCoreTabType(action)) {
    return action;
  }

  return Object.prototype.hasOwnProperty.call(CORE_TAB_TYPE_ALIASES, action)
    ? CORE_TAB_TYPE_ALIASES[action]
    : undefined;
};
