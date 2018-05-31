import {
  SET_TAB_BAR_TOGGLE_HANDLER,
  TAB_BAR_TOGGLE_HANDLER_THEME,
  TAB_BAR_TOGGLE_HANDLER_EXTENSION,
  SHOW_TAB_BAR_BY_EXTENSION,
  HIDE_TAB_BAR_BY_EXTENSION,
} from './constants';

import {
  showTabBarByExtension,
  hideTabBarByExtension,
  setTabBarToggleHandler,
} from './actions';

describe('TabBar actions', () => {
  describe('showTabBarByExtension()', () => {
    it('should work as expected', () => {
      expect(showTabBarByExtension()).toEqual({ type: SHOW_TAB_BAR_BY_EXTENSION });
    });
  });

  describe('hideTabBarByExtension()', () => {
    it('should work as expected', () => {
      expect(hideTabBarByExtension()).toEqual({ type: HIDE_TAB_BAR_BY_EXTENSION });
    });
  });

  describe('setTabBarToggleHandler()', () => {
    it('should apply TAB_BAR_TOGGLE_HANDLER_THEME by default', () => {
      expect(setTabBarToggleHandler()).toEqual({
        type: SET_TAB_BAR_TOGGLE_HANDLER,
        handler: TAB_BAR_TOGGLE_HANDLER_THEME,
      });
    });

    it('should apply TAB_BAR_TOGGLE_HANDLER_EXTENSION ', () => {
      expect(setTabBarToggleHandler(TAB_BAR_TOGGLE_HANDLER_EXTENSION)).toEqual({
        type: SET_TAB_BAR_TOGGLE_HANDLER,
        handler: TAB_BAR_TOGGLE_HANDLER_EXTENSION,
      });
    });
  });
});
