import {
  showAddToCartBar,
  hideAddToCartBar,
} from './actions';

import {
  SHOW_ADD_TO_CART_BAR,
  HIDE_ADD_TO_CART_BAR,
} from './constants';

describe('AddToCartBar actions', () => {
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
