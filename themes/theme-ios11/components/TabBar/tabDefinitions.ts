import {
  TAB_HOME,
  TAB_BROWSE,
  TAB_CART,
  TAB_FAVORITES,
  TAB_MORE,
} from './constants';

/**
 * How the tab of a core action looks. Core tabs don't take their label from the action.
 */
export interface TabDefinition {
  /**
   * The tab type: selects the tab component and its legacy `tab-bar.<type>` portals.
   */
  type: string;
  /**
   * I18n key of the tab label.
   */
  label: string;
}

const TAB_DEFINITIONS: Readonly<Record<string, TabDefinition>> = {
  home: {
    type: TAB_HOME,
    label: 'tab_bar.home',
  },
  browse: {
    type: TAB_BROWSE,
    label: 'tab_bar.browse',
  },
  categoryDrawer: {
    type: TAB_BROWSE,
    label: 'tab_bar.browse',
  },
  cart: {
    type: TAB_CART,
    label: 'tab_bar.cart',
  },
  favorites: {
    type: TAB_FAVORITES,
    label: 'tab_bar.favorites',
  },
  more: {
    type: TAB_MORE,
    label: 'tab_bar.more',
  },
};

/**
 * The tab types in the order of the legacy tab bar. Each equals the core action of the same name.
 */
export const CORE_TAB_TYPES = [TAB_HOME, TAB_BROWSE, TAB_CART, TAB_FAVORITES, TAB_MORE];

/**
 * Looks up the tab of a core action.
 * @param action The configured action.
 * @returns The tab definition, or undefined when the action is no core tab.
 */
export const getTabDefinition = (action: string): TabDefinition | undefined => (
  Object.prototype.hasOwnProperty.call(TAB_DEFINITIONS, action)
    ? TAB_DEFINITIONS[action]
    : undefined
);
