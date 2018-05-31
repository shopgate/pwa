import reducer from './reducer';
import {
  SET_TAB_BAR_TOGGLE_HANDLER,
  TAB_BAR_TOGGLE_HANDLER_THEME,
  TAB_BAR_TOGGLE_HANDLER_EXTENSION,
  SHOW_TAB_BAR_BY_EXTENSION,
  HIDE_TAB_BAR_BY_EXTENSION,
} from './constants';

describe('TabBar reducer', () => {
  let initialState;

  beforeEach(() => {
    initialState = {
      toggleHandler: TAB_BAR_TOGGLE_HANDLER_THEME,
      shownByExtension: false,
    };
  });

  it('should prepare a default state', () => {
    const state = reducer(undefined, { type: 'foo' });
    expect(state).toEqual(initialState);
  });

  describe('SET_TAB_BAR_TOGGLE_HANDLER', () => {
    it('should work as expected', () => {
      initialState = {
        ...initialState,
      };

      const state = reducer(initialState, {
        type: SET_TAB_BAR_TOGGLE_HANDLER,
        handler: TAB_BAR_TOGGLE_HANDLER_EXTENSION,
      });

      expect(state).toEqual({
        ...initialState,
        toggleHandler: TAB_BAR_TOGGLE_HANDLER_EXTENSION,
      });
    });
  });

  describe('SHOW_TAB_BAR_BY_EXTENSION', () => {
    it('should work as expected', () => {
      initialState = {
        ...initialState,
      };

      const state = reducer(initialState, { type: SHOW_TAB_BAR_BY_EXTENSION });
      expect(state).toEqual({
        ...initialState,
        shownByExtension: true,
      });
    });
  });

  describe('HIDE_TAB_BAR_BY_EXTENSION', () => {
    it('should work as expected', () => {
      initialState = {
        ...initialState,
        shownByExtension: true,
      };

      const state = reducer(initialState, { type: HIDE_TAB_BAR_BY_EXTENSION });
      expect(state).toEqual({
        ...initialState,
        shownByExtension: false,
      });
    });
  });
});
