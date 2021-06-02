import {
  incrementActionCount,
  decrementActionCount,
  resetActionCount,
  showAddToCartBar,
  hideAddToCartBar,
} from '.';

import {
  INCREMENT_ACTION_COUNT,
  DECREMENT_ACTION_COUNT,
  RESET_ACTION_COUNT,
  SHOW_ADD_TO_CART_BAR,
  HIDE_ADD_TO_CART_BAR,
} from '../constants';

describe('AddToCartBar actions', () => {
  describe('incrementActionCount()', () => {
    it('should work as expected', () => {
      expect(incrementActionCount()).toEqual({ type: INCREMENT_ACTION_COUNT });
    });
  });

  describe('decrementActionCount()', () => {
    it('should work as expected', () => {
      expect(decrementActionCount()).toEqual({ type: DECREMENT_ACTION_COUNT });
    });
  });

  describe('resetActionCount()', () => {
    it('should work as expected', () => {
      expect(resetActionCount()).toEqual({ type: RESET_ACTION_COUNT });
    });
  });

  describe('showAddToCartBar()', () => {
    it('should work as expected', () => {
      expect(showAddToCartBar()).toEqual({ type: SHOW_ADD_TO_CART_BAR });
    });
  });

  describe('hideAddToCartBar()', () => {
    it('should work as expected', () => {
      expect(hideAddToCartBar()).toEqual({ type: HIDE_ADD_TO_CART_BAR });
    });
  });
});
