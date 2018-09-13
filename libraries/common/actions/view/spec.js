import setViewLoading from './setViewLoading';
import unsetViewLoading from './unsetViewLoading';
import {
  SET_VIEW_LOADING,
  UNSET_VIEW_LOADING,
  INCREMENT_VIEW_LOADING,
  DECREMENT_VIEW_LOADING,
} from '../../constants/ActionTypes';

describe('Actions: view', () => {
  const state = {
    view: {
      isLoading: {},
    },
  };
  /**
   * A getState mock.
   * @return {Object}
   */
  const getState = () => state;
  const dispatch = jest.fn();
  const pathName = 'fooPath';

  describe('setViewLoading', () => {
    it('should set path loading state', () => {
      setViewLoading(pathName)(dispatch, getState);
      const action = dispatch.mock.calls[0][0];
      expect(typeof action).toBe('object');
      expect(action.type).toBe(SET_VIEW_LOADING);
      expect(action.pathname).toBe(pathName);
    });

    it('should increment loading state', () => {
      state.view.isLoading[pathName] = 1;
      setViewLoading(pathName)(dispatch, getState);
      const action = dispatch.mock.calls[1][0];
      expect(typeof action).toBe('object');
      expect(action.type).toBe(INCREMENT_VIEW_LOADING);
      expect(action.pathname).toBe(pathName);
    });
  });

  describe('unsetViewLoading', () => {
    it('should decrement loading state', () => {
      state.view.isLoading[pathName] = 2;
      unsetViewLoading(pathName)(dispatch, getState);
      const action = dispatch.mock.calls[2][0];
      expect(typeof action).toBe('object');
      expect(action.type).toBe(DECREMENT_VIEW_LOADING);
      expect(action.pathname).toBe(pathName);
    });

    it('should unset when loading state counter is 1', () => {
      state.view.isLoading[pathName] = 1;
      unsetViewLoading(pathName)(dispatch, getState);
      const action = dispatch.mock.calls[3][0];
      expect(typeof action).toBe('object');
      expect(action.type).toBe(UNSET_VIEW_LOADING);
      expect(action.pathname).toBe(pathName);
    });

    it('should unset when flush flag is true', () => {
      state.view.isLoading[pathName] = 2;
      unsetViewLoading(pathName, true)(dispatch, getState);
      const action = dispatch.mock.calls[4][0];
      expect(typeof action).toBe('object');
      expect(action.type).toBe(UNSET_VIEW_LOADING);
      expect(action.pathname).toBe(pathName);
    });
  });
});

