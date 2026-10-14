import { getNavigationAction, registerNavigationAction } from './registry';
import { CORE_NAVIGATION_ACTIONS } from './actions';
import type { NavigationActionHook } from './types';

jest.mock('./actions', () => ({
  CORE_NAVIGATION_ACTIONS: {
    cart: jest.fn(),
    favorites: jest.fn(),
  },
}));

const extension: NavigationActionHook = () => ({
  available: true,
  icon: 'heart',
  label: 'extension',
  onClick: jest.fn(),
});

describe('navigation action registry', () => {
  it('uses the core action while no extension replaces it', () => {
    expect(getNavigationAction('cart')).toBe(CORE_NAVIGATION_ACTIONS.cart);
  });

  it('lets an extension replace the core action', () => {
    registerNavigationAction('favorites', extension);

    expect(getNavigationAction('favorites')).toBe(extension);
  });

  it('knows no action without an implementation', () => {
    expect(getNavigationAction('share')).toBeUndefined();
  });
});
