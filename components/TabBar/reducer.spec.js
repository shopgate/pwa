import reducer from './reducer';
import {
  SET_TAB_BAR_ENABLED,
  SET_TAB_BAR_VISIBLE,
} from './constants';

describe('TabBar reducer', () => {
  const initialState = {
    enabled: true,
    visible: true,
  };

  it('should prepare a default state as expected', () => {
    const state = reducer(undefined, { type: 'foo' });
    expect(state).toEqual(initialState);
  });

  describe('SET_TAB_BAR_ENABLED', () => {
    it('should set the enabled state to false', () => {
      const result = reducer(initialState, {
        type: SET_TAB_BAR_ENABLED,
        enabled: false,
      });

      expect(result).toEqual({
        ...initialState,
        enabled: false,
      });
    });
  });

  describe('SET_TAB_BAR_VISIBLE', () => {
    it('should set the visible state to false', () => {
      const result = reducer(initialState, {
        type: SET_TAB_BAR_VISIBLE,
        visible: false,
      });

      expect(result).toEqual({
        ...initialState,
        visible: false,
      });
    });
  });
});
