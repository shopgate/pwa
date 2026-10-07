import reducer from './reducer';
import {
  ENABLE_TAB_BAR,
  DISABLE_TAB_BAR,
  SHOW_TAB_BAR,
  HIDE_TAB_BAR,
  SET_TAB_LAST_ROUTE,
} from './constants';

describe('TabBar reducer', () => {
  const initialState = {
    enabled: true,
    visible: true,
    lastRoutes: {},
  };

  it('should prepare a default state as expected', () => {
    const state = reducer(undefined, { type: 'foo' });
    expect(state).toEqual(initialState);
  });

  describe('ENABLE_TAB_BAR', () => {
    it('should set the enabled state to true', () => {
      const result = reducer(initialState, { type: ENABLE_TAB_BAR });

      expect(result).toEqual({
        ...initialState,
        enabled: true,
      });
    });
  });

  describe('DISABLE_TAB_BAR', () => {
    it('should set the enabled state to false', () => {
      const result = reducer(initialState, { type: DISABLE_TAB_BAR });

      expect(result).toEqual({
        ...initialState,
        enabled: false,
      });
    });
  });

  describe('SHOW_TAB_BAR', () => {
    it('should set the visible state to true', () => {
      const result = reducer(initialState, { type: SHOW_TAB_BAR });

      expect(result).toEqual({
        ...initialState,
        visible: true,
      });
    });
  });

  describe('HIDE_TAB_BAR', () => {
    it('should set the visible state to false', () => {
      const result = reducer(initialState, { type: HIDE_TAB_BAR });

      expect(result).toEqual({
        ...initialState,
        visible: false,
      });
    });
  });

  describe('SET_TAB_LAST_ROUTE', () => {
    it('should store the route per tab', () => {
      const first = reducer(initialState, {
        type: SET_TAB_LAST_ROUTE,
        tab: 'browse',
        route: { pathname: '/item/1' },
      });
      const second = reducer(first, {
        type: SET_TAB_LAST_ROUTE,
        tab: 'cart',
        route: { pathname: '/cart' },
      });

      expect(second.lastRoutes).toEqual({
        browse: { pathname: '/item/1' },
        cart: { pathname: '/cart' },
      });
    });
  });
});
