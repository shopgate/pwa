import {
  ENABLE_TAB_BAR,
  DISABLE_TAB_BAR,
  SHOW_TAB_BAR,
  HIDE_TAB_BAR,
} from './constants';

import {
  enableTabBar,
  disableTabBar,
  showTabBar,
  hideTabBar,
} from './actions';

describe('TabBar actions', () => {
  describe('enableTabBar()', () => {
    it('should work as expected', () => {
      const result = enableTabBar();
      expect(result).toEqual({ type: ENABLE_TAB_BAR });
    });
  });

  describe('disableTabBar()', () => {
    it('should work as expected', () => {
      const result = disableTabBar();
      expect(result).toEqual({ type: DISABLE_TAB_BAR });
    });
  });

  describe('showTabBar()', () => {
    it('should work as expected', () => {
      const result = showTabBar();
      expect(result).toEqual({ type: SHOW_TAB_BAR });
    });
  });

  describe('hideTabBar()', () => {
    it('should work as expected', () => {
      const result = hideTabBar();
      expect(result).toEqual({ type: HIDE_TAB_BAR });
    });
  });
});
