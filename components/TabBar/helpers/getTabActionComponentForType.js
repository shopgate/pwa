import {
  TAB_HOME,
  TAB_BROWSE,
  TAB_CART,
  TAB_MORE,
  TAB_FAVORITES,
} from '../constants';
import TabBarAction from '../components/TabBarAction';
import TabBarHomeAction from '../components/HomeAction';
import TabBarBrowseAction from '../components/BrowseAction';
import TabBarCartAction from '../components/CartAction';
import TabBarMoreAction from '../components/MoreAction';
import TabBarFavoritesAction from '../components/FavoritesAction';

export const tabs = {
  [TAB_HOME]: TabBarHomeAction,
  [TAB_BROWSE]: TabBarBrowseAction,
  [TAB_CART]: TabBarCartAction,
  [TAB_MORE]: TabBarMoreAction,
  [TAB_FAVORITES]: TabBarFavoritesAction,
};

/**
 * Resolves the tab action component for a given type.
 * @param {string} type The type name of the tab.
 * @return {Object} The corresponding component or the default tab action component.
 */
const getTabActionComponentForType = type => (tabs[type] || TabBarAction);

export default getTabActionComponentForType;
