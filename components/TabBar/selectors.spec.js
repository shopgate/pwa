import { INDEX_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import { FAVORITES_PATH } from '@shopgate/pwa-common-commerce/favorites/constants';
import { CATEGORY_PATH } from '@shopgate/pwa-common-commerce/category/constants';
import { SEARCH_PATH } from '@shopgate/pwa-common-commerce/search/constants';
import { BROWSE_PATH } from 'Pages/Browse/constants';
import { MORE_PATH } from 'Pages/More/constants';
import {
  TAB_HOME,
  TAB_BROWSE,
  TAB_CART,
  TAB_FAVORITES,
  TAB_MORE,
  TAB_NONE,
} from './constants';

import { getMockedState } from './mock';

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

let mockedPathname;
jest.mock('@virtuous/conductor-helpers/getCurrentRoute', () => () => ({ pathname: mockedPathname }));

describe('TabBar selectors', () => {
  beforeEach(() => {
    mockedPathname = '';
    jest.resetModules();
  });

  describe('getActiveTab()', () => {
    it('should return TAB_HOME', () => {
      mockedPathname = INDEX_PATH;
      const result = getActiveTab({});
      expect(result).toEqual(TAB_HOME);
    });

    it('should return TAB_BROWSE', () => {
      const paths = [BROWSE_PATH, SEARCH_PATH, CATEGORY_PATH];

      paths.forEach((pathname) => {
        mockedPathname = pathname;
        const result = getActiveTab({});
        expect(result).toEqual(TAB_BROWSE);
      });
    });

    it('should return TAB_CART', () => {
      mockedPathname = CART_PATH;
      const result = getActiveTab({});
      expect(result).toEqual(TAB_CART);
    });

    it('should return TAB_MORE', () => {
      mockedPathname = MORE_PATH;
      const result = getActiveTab({});
      expect(result).toEqual(TAB_MORE);
    });

    it('should return TAB_FAVORITES', () => {
      mockedPathname = FAVORITES_PATH;
      const result = getActiveTab({});
      expect(result).toEqual(TAB_FAVORITES);
    });

    it('should return TAB_NONE', () => {
      mockedPathname = '/unknown';
      const result = getActiveTab({});
      expect(result).toEqual(TAB_NONE);
    });
  });

  describe('isTabBarEnabled()', () => {
    it('should return true', () => {
      const state = getMockedState(true);
      const result = isTabBarEnabled(state);
      expect(result).toBe(true);
    });

    it('should return false', () => {
      const state = getMockedState(false);
      const result = isTabBarEnabled(state);
      expect(result).toBe(false);
    });
  });

  describe('isTabBarVisible()', () => {
    it('should return true when when the tabbar is enabled and visible', () => {
      const state = getMockedState(true, true);
      const result = isTabBarVisible(state);
      expect(result).toBe(true);
    });

    it('should return false when when the tabbar is not enabled and visible', () => {
      const state = getMockedState(false, true);
      const result = isTabBarVisible(state);
      expect(result).toBe(false);
    });

    it('should return false when when the tabbar is not enabled and not visible', () => {
      const state = getMockedState(false, false);
      const result = isTabBarVisible(state);
      expect(result).toBe(false);
    });

    it('should return false when the tabbar is enabled but not visible', () => {
      const state = getMockedState(true, false);
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
