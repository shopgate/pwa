import { INDEX_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import { FAVORITES_PATH } from '@shopgate/pwa-common-commerce/favorites/constants';
import {
  TAB_BAR_TOGGLE_HANDLER_THEME,
  TAB_BAR_TOGGLE_HANDLER_EXTENSION,
} from './constants';
import { mockedStateRoute } from './mock';

import {
  isTabBarVisibleByExtension,
  isTabBarVisible,
} from './selectors';

describe('TabBar selectors', () => {
  describe('isTabBarVisibleByExtension()', () => {
    it('should return null if the visibility state is handled by the theme', () => {
      const state = mockedStateRoute(INDEX_PATH, false, TAB_BAR_TOGGLE_HANDLER_THEME);
      const result = isTabBarVisibleByExtension(state);
      expect(result).toBeNull();
    });

    it('should return true if the visibility state is handled by the extension', () => {
      const state = mockedStateRoute(INDEX_PATH, true, TAB_BAR_TOGGLE_HANDLER_EXTENSION);
      const result = isTabBarVisibleByExtension(state);
      expect(result).toBe(true);
    });

    it('should return false if the visibility state is handled by the extension', () => {
      const state = mockedStateRoute(INDEX_PATH, false, TAB_BAR_TOGGLE_HANDLER_EXTENSION);
      const result = isTabBarVisibleByExtension(state);
      expect(result).toBe(false);
    });
  });

  describe('isTabBarVisible()', () => {
    describe('default', () => {
      it('should return true on a not blacklisted route', () => {
        const state = mockedStateRoute(INDEX_PATH);
        const result = isTabBarVisible(state);
        expect(result).toBe(true);
      });

      it('should return false on a not blacklisted route', () => {
        const state = mockedStateRoute(CART_PATH);
        const result = isTabBarVisible(state);
        expect(result).toBe(false);
      });
    });

    describe('favorites route', () => {
      it('should return true on the favorite list route when the list has entries', () => {
        const state = mockedStateRoute(FAVORITES_PATH);
        const result = isTabBarVisible(state);
        expect(result).toBe(true);
      });

      it('should return false on the favorite list route when the list has entries', () => {
        const state = mockedStateRoute(FAVORITES_PATH);
        state.favorites.products.ids = [];
        const result = isTabBarVisible(state);
        expect(result).toBe(false);
      });
    });

    describe('toggle handler: extension', () => {
      it('should return true when an extension handles the visibility and the bar is visible', () => {
        const state = mockedStateRoute(FAVORITES_PATH, true, TAB_BAR_TOGGLE_HANDLER_EXTENSION);
        const result = isTabBarVisible(state);
        expect(result).toBe(true);
      });

      it('should return false when an extension handles the visibility and the bar is hidden', () => {
        const state = mockedStateRoute(FAVORITES_PATH, false, TAB_BAR_TOGGLE_HANDLER_EXTENSION);
        const result = isTabBarVisible(state);
        expect(result).toBe(false);
      });
    });
  });
});
