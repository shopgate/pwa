import {
  TAB_HOME,
  TAB_CART,
  TAB_FAVORITES,
} from '../constants';
import TabBarAction from '../components/TabBarAction';
import TabBarHomeAction from '../components/HomeAction';
import TabBarCartAction from '../components/CartAction';
import TabBarFavoritesAction from '../components/FavoritesAction';

import helper from './getTabActionComponentForType';

describe('getTabActionComponentForType', () => {
  describe('TAB_HOME', () => {
    it('should work as expected', () => {
      expect(helper(TAB_HOME)).toEqual(TabBarHomeAction);
    });
  });

  describe('TAB_CART', () => {
    it('should work as expected', () => {
      expect(helper(TAB_CART)).toEqual(TabBarCartAction);
    });
  });

  describe('TAB_FAVORITES', () => {
    it('should work as expected', () => {
      expect(helper(TAB_FAVORITES)).toEqual(TabBarFavoritesAction);
    });
  });

  describe('unknown', () => {
    it('should work as expected', () => {
      expect(helper('unknown')).toEqual(TabBarAction);
    });
  });
});
