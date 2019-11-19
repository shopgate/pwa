import { configuration } from '@shopgate/pwa-common/collections';
import { TAB_BAR_PATTERNS_BLACK_LIST } from '@shopgate/pwa-common/constants/Configuration';
import { LOGIN_PATH, CHECKOUT_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';

import shouldCartHaveTabBar from './shouldCartHaveTabBar';
import isTabBarVisible from './isTabBarVisible';

jest.mock('./shouldCartHaveTabBar', () => jest.fn().mockReturnValue(true));

describe('isTabBarVisible()', () => {
  beforeAll(() => {
    configuration.set(TAB_BAR_PATTERNS_BLACK_LIST, [CHECKOUT_PATH]);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return FALSE for the cart pattern with items inside the cart', () => {
    shouldCartHaveTabBar.mockReturnValueOnce(false);
    expect(isTabBarVisible({}, CART_PATH)).toBe(false);
  });

  it('should return TRUE for the cart pattern with an empty cart', () => {
    expect(isTabBarVisible({}, CART_PATH)).toBe(true);
  });

  it('should return TRUE for a pattern which is not on the blacklist', () => {
    expect(isTabBarVisible({}, LOGIN_PATH)).toBe(true);
  });

  it('should return FALSE for a pattern which is on the blacklist', () => {
    expect(isTabBarVisible({}, CHECKOUT_PATH)).toBe(false);
  });
});
