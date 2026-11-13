import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { registerNavigationAction } from '@shopgate/engage/navigation/registry';
import type { ResolvedNavigationAction } from '@shopgate/engage/navigation/types';
import ActionButton from './index';

let mockCounts: Record<string, number> = {};
let mockCartFields: Partial<ResolvedNavigationAction> = {};
let mockShowFavoritesBadge = true;
let mockShowFavoritesCounter = true;

jest.mock('react-redux', () => ({
  useSelector: (selector: (state: unknown) => unknown) => selector({}),
}));
jest.mock('@shopgate/engage/components', () => ({
  AppBarIOS: { Icon: jest.requireActual('@shopgate/pwa-ui-ios/AppBar/components/Icon').default },
  Badge: jest.requireActual('@shopgate/engage/components/Badge').default,
  SurroundPortals: ({ children }: { children: unknown }) => children,
}));
jest.mock('@shopgate/engage/navigation/actions', () => ({
  CORE_NAVIGATION_ACTIONS: {
    cart: () => ({
      available: true,
      icon: 'cart',
      label: 'navigation.cart',
      onClick: jest.fn(),
      badgeCount: mockCounts.cart,
      ...mockCartFields,
    }),
    favorites: () => ({
      available: true,
      icon: 'heart',
      label: 'navigation.favorites',
      onClick: jest.fn(),
      badgeCount: mockCounts.favorites,
    }),
    openSearch: () => ({
      available: true,
      icon: 'magnifier',
      label: 'search.label',
      onClick: jest.fn(),
    }),
  },
}));
jest.mock('@shopgate/engage/settings/selectors/shopSettings', () => ({
  getShowWishlistItemsCountBadge: () => mockShowFavoritesBadge,
}));
jest.mock('../../../TabBar/components/FavoritesIconBadge/hooks', () => ({
  useShowFavoritesCounter: () => mockShowFavoritesCounter,
}));
jest.mock('../../../../helpers/actionIcons', () => ({ getActionIcon: () => null }));

let mockAction: Partial<ResolvedNavigationAction> = {};

registerNavigationAction('@shopgate/test/card', () => ({
  available: true,
  icon: '',
  label: 'Card',
  onClick: jest.fn(),
  ...mockAction,
}));

/**
 * Renders the header button of an action.
 * @param action The name of the configured action.
 * @returns The button.
 */
const renderButton = (action: string) => {
  const settings = {
    action,
    icon: '',
    link: '',
  };

  render(<ActionButton settings={settings} slot="right1" />);
  return screen.getByRole('button');
};

/**
 * Renders the header button of the test extension action with the given badge fields.
 * @param action The badge fields of the resolved action.
 * @returns The button.
 */
const renderExtensionButton = (action: Partial<ResolvedNavigationAction>) => {
  mockAction = action;
  return renderButton('@shopgate/test/card');
};

/**
 * Finds the badge of a button.
 * @param button The button.
 * @returns The badge, or null without one.
 */
const getBadge = (button: HTMLElement) => button.querySelector('.theme__app-bar__action-badge');

describe('<ActionButton />', () => {
  beforeEach(() => {
    mockCounts = {};
    mockCartFields = {};
    mockShowFavoritesBadge = true;
    mockShowFavoritesCounter = true;
  });

  describe('extension action', () => {
    it('shows the count and announces it with the label', () => {
      const button = renderExtensionButton({ badgeCount: 3 });

      expect(getBadge(button)).toHaveTextContent('3');
      expect(button).toHaveAttribute('aria-label', 'Card, 3');
    });

    it('shows counts above 99 as 99+', () => {
      const button = renderExtensionButton({ badgeCount: 120 });

      expect(getBadge(button)).toHaveTextContent('99+');
      expect(button).toHaveAttribute('aria-label', 'Card, 120');
    });

    it('caps the count at the maximum of the action', () => {
      const button = renderExtensionButton({
        badgeCount: 12,
        badgeMax: 9,
      });

      expect(getBadge(button)).toHaveTextContent('9+');
    });

    it('shows a dot without a number in dot mode, named by the label', () => {
      const button = renderExtensionButton({
        badgeCount: 2,
        badgeShowCount: false,
      });

      expect(getBadge(button)).toBeInTheDocument();
      expect(getBadge(button)).toBeEmptyDOMElement();
      expect(button).toHaveAttribute('aria-label', 'Card');
    });

    it('shows no dot in dot mode while the count is 0', () => {
      const button = renderExtensionButton({
        badgeCount: 0,
        badgeShowCount: false,
      });

      expect(getBadge(button)).not.toBeInTheDocument();
    });

    it.each([true, false])('names the button by the badge label of the action (showCount %j)', (badgeShowCount) => {
      const button = renderExtensionButton({
        badgeCount: 3,
        badgeShowCount,
        badgeLabel: 'Card, 3 new',
      });

      expect(getBadge(button)).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-label', 'Card, 3 new');
    });

    it('shows no badge for a negative count', () => {
      const button = renderExtensionButton({ badgeCount: -2 });

      expect(getBadge(button)).not.toBeInTheDocument();
      expect(button).toHaveAttribute('aria-label', 'Card');
    });

    it('is named by the label without a badge', () => {
      const button = renderExtensionButton({ badgeLabel: 'Card, nothing new' });

      expect(getBadge(button)).not.toBeInTheDocument();
      expect(button).toHaveAttribute('aria-label', 'Card');
    });
  });

  describe('core actions', () => {
    it('labels the cart with the number of products', () => {
      mockCounts.cart = 120;
      const button = renderButton('cart');

      expect(getBadge(button)).toHaveTextContent('99+');
      expect(button).toHaveAttribute('aria-label', 'navigation.cart. common.products: 120.');
    });

    it('shows no cart badge while the cart is empty', () => {
      mockCounts.cart = 0;
      const button = renderButton('cart');

      expect(getBadge(button)).not.toBeInTheDocument();
      expect(button).toHaveAttribute('aria-label', 'navigation.cart');
    });

    it('shows a dot for a cart action in dot mode', () => {
      mockCounts.cart = 3;
      mockCartFields = { badgeShowCount: false };
      const button = renderButton('cart');

      expect(getBadge(button)).toBeInTheDocument();
      expect(getBadge(button)).toBeEmptyDOMElement();
      expect(button).toHaveAttribute('aria-label', 'navigation.cart');
    });

    it('names an action without a counter by its label', () => {
      const button = renderButton('openSearch');

      expect(getBadge(button)).not.toBeInTheDocument();
      expect(button).toHaveAttribute('aria-label', 'search.label');
    });

    it('shows the favorites counter as configured for the tab bar', () => {
      mockCounts.favorites = 4;
      const button = renderButton('favorites');

      expect(getBadge(button)).toHaveTextContent('4');
      expect(button).toHaveAttribute('aria-label', 'navigation.favorites. common.products: 4.');
    });

    it('shows a dot for the favorites while the counter is switched off', () => {
      mockCounts.favorites = 4;
      mockShowFavoritesCounter = false;
      const button = renderButton('favorites');

      expect(getBadge(button)).toBeEmptyDOMElement();
      expect(button).toHaveAttribute('aria-label', 'navigation.favorites');
    });

    it('shows no favorites badge while the shop hides it', () => {
      mockCounts.favorites = 4;
      mockShowFavoritesBadge = false;
      const button = renderButton('favorites');

      expect(getBadge(button)).not.toBeInTheDocument();
      expect(button).toHaveAttribute('aria-label', 'navigation.favorites');
    });
  });
});
