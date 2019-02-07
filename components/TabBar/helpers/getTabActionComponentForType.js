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

/**
 * Resolves the tab action component for a given type.
 * @param {string} type The type name of the tab.
 * @return {Function|string} The corresponding component or the default tab action component.
 */
const getTabActionComponentForType = (type) => {
  switch (type) {
    case TAB_HOME:
      return TabBarHomeAction;
    case TAB_BROWSE:
      return TabBarBrowseAction;
    case TAB_CART:
      return TabBarCartAction;
    case TAB_MORE:
      return TabBarMoreAction;
    case TAB_FAVORITES:
      return TabBarFavoritesAction;
    default:
      return TabBarAction;
  }
};

export default getTabActionComponentForType;
