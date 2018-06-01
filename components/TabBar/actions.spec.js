import {
  SET_TAB_BAR_ENABLED,
  SET_TAB_BAR_VISIBLE,
} from './constants';

import {
  setTabBarEnabled,
  setTabBarVisible,
} from './actions';

describe('TabBar actions', () => {
  describe('setTabBarEnabled()', () => {
    it('should set enabled to true when no parameter is passed', () => {
      const result = setTabBarEnabled();
      expect(result).toEqual({
        type: SET_TAB_BAR_ENABLED,
        enabled: true,
      });
    });

    it('should set enabled to false when false is passed as parameter', () => {
      const result = setTabBarEnabled(false);
      expect(result).toEqual({
        type: SET_TAB_BAR_ENABLED,
        enabled: false,
      });
    });
  });

  describe('setTabBarVisible()', () => {
    it('should set visible to true when no parameter is passed', () => {
      const result = setTabBarVisible();
      expect(result).toEqual({
        type: SET_TAB_BAR_VISIBLE,
        visible: true,
      });
    });

    it('should set visible to false when false is passed as parameter', () => {
      const result = setTabBarVisible(false);
      expect(result).toEqual({
        type: SET_TAB_BAR_VISIBLE,
        visible: false,
      });
    });
  });
});
