import {
  TAB_HOME,
  TAB_CART,
  TAB_FAVORITES,
} from '../constants';
import TabBarAction from '../components/TabBarAction';
import TabBarHomeAction from '../components/HomeAction';
import TabBarCartAction from '../components/CartAction';
import TabBarFavoritesAction from '../components/FavoritesAction';

/**
 * Resolves the tab action component for a given type.
 * @param {string} type The type name of the tab.
 * @return {function|string} The corresponding component or the default tab action component.
 */
const getTabActionComponentForType = (type) => {
  switch (type) {
    case TAB_HOME:
      return TabBarHomeAction;
    case TAB_CART:
      return TabBarCartAction;
    case TAB_FAVORITES:
      return TabBarFavoritesAction;
    default:
      return TabBarAction;
  }
};

export default getTabActionComponentForType;
