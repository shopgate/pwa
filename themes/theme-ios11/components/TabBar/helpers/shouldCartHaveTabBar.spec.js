import { getCartItems } from '@shopgate/pwa-common-commerce/cart/selectors';
import shouldCartHaveTabBar from './shouldCartHaveTabBar';

jest.mock('@shopgate/pwa-common-commerce/cart/selectors', () => ({
  getCartItems: jest.fn().mockReturnValue([]),
}));

describe('shouldCartHaveTabBar()', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return TRUE when the cart is empty', () => {
    expect(shouldCartHaveTabBar({})).toBe(true);
  });

  it('should return FALSE when the cart has items', () => {
    getCartItems.mockReturnValueOnce([{}, {}]);
    expect(shouldCartHaveTabBar({})).toBe(false);
  });
});
