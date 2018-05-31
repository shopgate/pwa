import {
  SHOW_ADD_TO_CART_BAR,
  HIDE_ADD_TO_CART_BAR,
} from './constants';

import reducer from './reducer';

describe('AddToCartBar reducer', () => {
  const initialState = {
    added: 0,
    show: true,
  };

  it('should prepare a default state', () => {
    const state = reducer(undefined, { type: 'foo' });
    expect(state).toEqual(initialState);
  });

  describe('SHOW_ADD_TO_CART_BAR', () => {
    it('should work as expected', () => {
      const state = reducer(initialState, { type: SHOW_ADD_TO_CART_BAR });
      expect(state).toEqual({
        ...initialState,
        show: true,
      });
    });
  });

  describe('HIDE_ADD_TO_CART_BAR', () => {
    it('should work as expected', () => {
      const state = reducer(initialState, { type: HIDE_ADD_TO_CART_BAR });
      expect(state).toEqual({
        ...initialState,
        show: false,
      });
    });
  });
});

