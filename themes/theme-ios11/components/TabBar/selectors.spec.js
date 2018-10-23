import { INDEX_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import { CATEGORY_PATH } from '@shopgate/pwa-common-commerce/category/constants';
import { FAVORITES_PATH } from '@shopgate/pwa-common-commerce/favorites/constants';
import { SEARCH_PATH } from '@shopgate/pwa-common-commerce/search/constants';
import {
  TAB_HOME,
  TAB_BROWSE,
  TAB_CART,
  TAB_FAVORITES,
  TAB_MORE,
  TAB_NONE,
} from './constants';

import { mockedStateRoute } from './mock';

import {
  getActiveTab,
  isTabBarEnabled,
  isTabBarVisible,
  getVisibleTabs,
} from './selectors';

let mockedHasFavorites = true;

jest.mock('@shopgate/pwa-common/helpers/config', () => ({
  get hasFavorites() { return mockedHasFavorites; },
  themeConfig: {
    colors: {},
  },
}));

describe.skip('TabBar selectors', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe('getActiveTab()', () => {
    it('should return TAB_HOME', () => {
      const state = mockedStateRoute(INDEX_PATH);
      const result = getActiveTab(state);
      expect(result).toEqual(TAB_HOME);
    });

    it('should return TAB_CART', () => {
      const state = mockedStateRoute(CART_PATH);
      const result = getActiveTab(state);
      expect(result).toEqual(TAB_CART);
    });

    it('should return TAB_FAVORITES', () => {
      const state = mockedStateRoute(FAVORITES_PATH);
      const result = getActiveTab(state);
      expect(result).toEqual(TAB_FAVORITES);
    });

    it('should return TAB_NONE', () => {
      const state = mockedStateRoute('/unknown');
      const result = getActiveTab(state);
      expect(result).toEqual(TAB_NONE);
    });
  });

  describe('isTabBarEnabled()', () => {
    it('should return true', () => {
      const state = mockedStateRoute(undefined, true);
      const result = isTabBarEnabled(state);
      expect(result).toBe(true);
    });

    it('should return false', () => {
      const state = mockedStateRoute(undefined, false);
      const result = isTabBarEnabled(state);
      expect(result).toBe(false);
    });
  });

  describe('isTabBarVisible()', () => {
    it('should return true when when the tabbar is enabled and visible', () => {
      const state = mockedStateRoute(undefined, true, true);
      const result = isTabBarVisible(state);
      expect(result).toBe(true);
    });

    it('should return false when when the tabbar is not enabled and visible', () => {
      const state = mockedStateRoute(undefined, false, true);
      const result = isTabBarVisible(state);
      expect(result).toBe(false);
    });

    it('should return false when when the tabbar is not enabled and not visible', () => {
      const state = mockedStateRoute(undefined, false, false);
      const result = isTabBarVisible(state);
      expect(result).toBe(false);
    });

    it('should return false when the tabbar is enabled but not visible', () => {
      const state = mockedStateRoute(undefined, true, false);
      const result = isTabBarVisible(state);
      expect(result).toBe(false);
    });
  });

  describe('getVisibleTabs()', () => {
    it('should return four tabs when favorites are inactive', () => {
      mockedHasFavorites = false;

      const result = getVisibleTabs();
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(4);
    });

    it('should return five tabs when favorites are active', () => {
      mockedHasFavorites = true;

      const result = getVisibleTabs();
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(5);
    });
  });
});
