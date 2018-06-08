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

import helper from './getTabActionComponentForType';

describe('getTabActionComponentForType', () => {
  describe('TAB_HOME', () => {
    it('should work as expected', () => {
      expect(helper(TAB_HOME)).toEqual(TabBarHomeAction);
    });
  });

  describe('TAB_BROWSE', () => {
    it('should work as expected', () => {
      expect(helper(TAB_BROWSE)).toEqual(TabBarBrowseAction);
    });
  });

  describe('TAB_CART', () => {
    it('should work as expected', () => {
      expect(helper(TAB_CART)).toEqual(TabBarCartAction);
    });
  });

  describe('TAB_MORE', () => {
    it('should work as expected', () => {
      expect(helper(TAB_MORE)).toEqual(TabBarMoreAction);
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
