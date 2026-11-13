import {
  TAB_HOME,
  TAB_BROWSE,
  TAB_CART,
  TAB_MORE,
  TAB_FAVORITES,
} from '../constants';
import TabBarAction from '../components/TabBarAction';
import { createCoreTabAction } from '../components/CoreTabAction';

export const tabs = {
  [TAB_HOME]: createCoreTabAction(TAB_HOME),
  [TAB_BROWSE]: createCoreTabAction(TAB_BROWSE),
  [TAB_CART]: createCoreTabAction(TAB_CART),
  [TAB_MORE]: createCoreTabAction(TAB_MORE),
  [TAB_FAVORITES]: createCoreTabAction(TAB_FAVORITES),
};

/**
 * Resolves the tab action component for a given type.
 * @param {string} type The type name of the tab.
 * @return {Object} The corresponding component or the default tab action component.
 */
const getTabActionComponentForType = type => (tabs[type] || TabBarAction);

export default getTabActionComponentForType;
