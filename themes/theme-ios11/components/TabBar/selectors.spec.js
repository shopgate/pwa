import { INDEX_PATH } from '@shopgate/engage/core';
import { CART_PATH } from '@shopgate/engage/cart';
import { FAVORITES_PATH } from '@shopgate/engage/favorites';
import { CATEGORY_PATH } from '@shopgate/engage/category';
import { SEARCH_PATH } from '@shopgate/engage/search';
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
} from './selectors';

const mockedHasFavorites = true;

jest.mock('@shopgate/pwa-common/helpers/config', () => ({
  get hasFavorites() { return mockedHasFavorites; },
  themeConfig: {
    colors: {},
  },
}));

/**
 * Creates a mocked router state for the selectors.
 * @param {string} pathname The pathname for the current route.
 * @returns {Object}
 */
const getMockedRouterState = pathname => ({
  router: {
    currentRoute: {
      pathname,
    },
  },
});

describe('TabBar selectors', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe('getActiveTab()', () => {
    it('should return TAB_HOME', () => {
      const result = getActiveTab(getMockedRouterState(INDEX_PATH));
      expect(result).toEqual(TAB_HOME);
    });

    it('should return TAB_BROWSE', () => {
      const paths = [BROWSE_PATH, SEARCH_PATH, CATEGORY_PATH];

      paths.forEach((pathname) => {
        const result = getActiveTab(getMockedRouterState(pathname));
        expect(result).toEqual(TAB_BROWSE);
      });
    });

    it('should return TAB_CART', () => {
      const result = getActiveTab(getMockedRouterState(CART_PATH));
      expect(result).toEqual(TAB_CART);
    });

    it('should return TAB_MORE', () => {
      const result = getActiveTab(getMockedRouterState(MORE_PATH));
      expect(result).toEqual(TAB_MORE);
    });

    it('should return TAB_FAVORITES', () => {
      const result = getActiveTab(getMockedRouterState(FAVORITES_PATH));
      expect(result).toEqual(TAB_FAVORITES);
    });

    it('should return TAB_NONE', () => {
      const result = getActiveTab(getMockedRouterState('/unknown'));
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
});
