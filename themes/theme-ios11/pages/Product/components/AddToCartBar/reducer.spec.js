import {
  INCREMENT_ACTION_COUNT,
  DECREMENT_ACTION_COUNT,
  RESET_ACTION_COUNT,
  SHOW_ADD_TO_CART_BAR,
  HIDE_ADD_TO_CART_BAR,
} from './constants';

import reducer from './reducer';

describe('AddToCartBar reducer', () => {
  const initialState = {
    added: 0,
    visible: true,
  };

  it('should prepare a default state', () => {
    const state = reducer(undefined, { type: 'foo' });
    expect(state).toEqual(initialState);
  });

  describe('INCREMENT_ACTION_COUNT', () => {
    it('should work as expected', () => {
      const state = reducer(initialState, { type: INCREMENT_ACTION_COUNT });
      expect(state).toEqual({
        ...initialState,
        added: initialState.added + 1,
      });
    });
  });

  describe('DECREMENT_ACTION_COUNT', () => {
    it('should work as expected', () => {
      const modifiedState = {
        ...initialState,
        added: 3,
      };

      const state = reducer(modifiedState, { type: DECREMENT_ACTION_COUNT });
      expect(state).toEqual({
        ...initialState,
        added: modifiedState.added - 1,
      });
    });

    it('should not turn into negative numbers', () => {
      const state = reducer(initialState, { type: DECREMENT_ACTION_COUNT });
      expect(state).toEqual({
        ...initialState,
        added: 0,
      });
    });
  });

  describe('RESET_ACTION_COUNT', () => {
    it('should work as expected', () => {
      const state = reducer(initialState, { type: RESET_ACTION_COUNT });
      expect(state).toEqual({
        ...initialState,
        added: 0,
      });
    });
  });

  describe('SHOW_ADD_TO_CART_BAR', () => {
    it('should work as expected', () => {
      const state = reducer(initialState, { type: SHOW_ADD_TO_CART_BAR });
      expect(state).toEqual({
        ...initialState,
        visible: true,
      });
    });
  });

  describe('HIDE_ADD_TO_CART_BAR', () => {
    it('should work as expected', () => {
      const state = reducer(initialState, { type: HIDE_ADD_TO_CART_BAR });
      expect(state).toEqual({
        ...initialState,
        visible: false,
      });
    });
  });
});

