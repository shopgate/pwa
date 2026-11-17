import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { logger } from '@shopgate/engage/core/helpers';
import { registerNavigationAction } from '@shopgate/engage/navigation/registry';
import type { NavigationActionMeta, ResolvedNavigationAction } from '@shopgate/engage/navigation/types';
import ExtensionAction from './index';

jest.mock('@shopgate/engage/components', () => ({
  I18n: { Text: ({ string }: { string: string }) => string },
  Badge: jest.requireActual('@shopgate/engage/components/Badge').default,
}));
jest.mock('@shopgate/engage/navigation/actions', () => ({ CORE_NAVIGATION_ACTIONS: {} }));
jest.mock('@shopgate/engage/icons/helpers', () => ({
  ...jest.requireActual('@shopgate/engage/icons/helpers'),
  resolveIcon: (name: string) => (mockIconNames.includes(name) ? {} : null),
}));
jest.mock('@shopgate/engage/icons/components/ThemeIcon', () => ({
  __esModule: true,
  default: ({ name }: { name: string }) => <svg data-icon={name} />,
}));
jest.mock('../../hooks', () => ({ useTabBarSettings: () => mockTabBarSettings }));

let mockAction: Partial<ResolvedNavigationAction> = {};
let mockTabBarSettings: { showLabels?: boolean } = {};
let mockIconNames: string[] = [];

registerNavigationAction('@shopgate/test/card', () => ({
  available: true,
  icon: '',
  label: 'card.action',
  onClick: jest.fn(),
  ...mockAction,
}), {
  tabBar: {
    label: 'Card',
    icon: '',
  },
});

registerNavigationAction('@shopgate/test/icon', () => ({
  available: true,
  icon: 'action-icon',
  label: 'icon.action',
  onClick: jest.fn(),
}), {
  tabBar: {
    label: 'Icon',
    icon: 'tab-icon',
  },
});

/**
 * Renders the tab of the test action with the given badge fields.
 * @param action The badge fields of the resolved action.
 * @returns The tab.
 */
const renderTab = (action: Partial<ResolvedNavigationAction>) => {
  mockAction = action;
  const settings = {
    action: '@shopgate/test/card',
    icon: '',
    link: '',
  };

  render(<ExtensionAction settings={settings} />);
  return screen.getByRole('tab');
};

/**
 * Finds the badge of a tab.
 * @param tab The tab.
 * @returns The badge, or null without one.
 */
const getBadge = (tab: HTMLElement) => tab.querySelector('.theme__tab-bar__extension-badge');

describe('<ExtensionAction />', () => {
  beforeEach(() => {
    mockTabBarSettings = {};
    mockIconNames = [];
  });

  it('shows the count and announces it with the label', () => {
    const tab = renderTab({ badgeCount: 3 });

    expect(getBadge(tab)).toHaveTextContent('3');
    expect(tab).toHaveAttribute('aria-label', 'Card, 3');
  });

  it('has no badge and is named by the label while the count is 0', () => {
    const tab = renderTab({ badgeCount: 0 });

    expect(getBadge(tab)).not.toBeInTheDocument();
    expect(tab).toHaveAttribute('aria-label', 'Card');
  });

  it('caps the count of the badge at the badgeMax of the action', () => {
    const tab = renderTab({
      badgeCount: 12,
      badgeMax: 9,
    });

    expect(getBadge(tab)).toHaveTextContent(/^9\+$/);
  });

  it('shows a dot without the count while the action sets badgeShowCount to false', () => {
    const tab = renderTab({
      badgeCount: 5,
      badgeShowCount: false,
    });

    expect(getBadge(tab)).toBeInTheDocument();
    expect(getBadge(tab)).toBeEmptyDOMElement();
  });

  it('keeps its accessible name while the tab bar hides the labels', () => {
    mockTabBarSettings = { showLabels: false };
    const tab = renderTab({});

    expect(tab).not.toHaveTextContent('Card');
    expect(tab).toHaveAccessibleName('Card');
  });

  describe('label', () => {
    const FALLBACK_ACTION = '@shopgate/test/fallback';
    let warn: jest.SpyInstance;

    beforeEach(() => {
      warn = jest.spyOn(logger, 'warn').mockImplementation(() => undefined);
    });

    afterEach(() => {
      warn.mockRestore();
    });

    /**
     * Registers the fallback test action and renders its tab.
     * @param tabBar The fields of the tab details, which may have any type.
     * @param action The fields of the resolved action.
     * @returns The tab.
     */
    const renderFallbackTab = (
      tabBar: Record<string, unknown>,
      action: Partial<ResolvedNavigationAction> = {}
    ) => {
      registerNavigationAction(FALLBACK_ACTION, () => ({
        available: true,
        icon: '',
        label: '',
        onClick: jest.fn(),
        ...action,
      }), {
        tabBar: {
          icon: '',
          ...tabBar,
        } as unknown as NavigationActionMeta['tabBar'],
      });

      render(<ExtensionAction settings={{
        action: FALLBACK_ACTION,
        icon: '',
        link: '',
      }}
      />);

      return screen.getByRole('tab');
    };

    it('shows the label of the resolved action for an empty tab label', () => {
      const tab = renderFallbackTab({
        label: '',
        adminLabel: { 'en-us': 'Customer card' },
      }, { label: 'Card action' });

      expect(tab).toHaveTextContent('Card action');
      expect(tab).toHaveAccessibleName('Card action');
    });

    it('shows the admin label of the shop language for a null tab label without a label of the resolved action', () => {
      const tab = renderFallbackTab({
        label: null,
        adminLabel: {
          'en-us': 'Customer card',
          'de-de': 'Kundenkarte',
        },
      });

      expect(tab).toHaveTextContent('Kundenkarte');
      expect(tab).toHaveAccessibleName('Kundenkarte');
    });

    it('shows the name of the action for an empty tab label without any other text', () => {
      const tab = renderFallbackTab({ label: '' });

      expect(tab).toHaveTextContent(FALLBACK_ACTION);
      expect(tab).toHaveAccessibleName(FALLBACK_ACTION);
    });

    it('announces the badge with the fallback label', () => {
      const tab = renderFallbackTab({ label: '' }, {
        label: 'Card action',
        badgeCount: 2,
      });

      expect(tab).toHaveAttribute('aria-label', 'Card action, 2');
    });
  });

  describe('icon', () => {
    /**
     * Renders the tab of the icon test action.
     * @param icon The icon the merchant picked.
     * @returns The icon slot of the tab.
     */
    const renderIconSlot = (icon = '') => {
      render(<ExtensionAction settings={{
        action: '@shopgate/test/icon',
        icon,
        link: '',
      }}
      />);

      return screen.getByRole('tab').querySelector('.theme__tab-bar__icon');
    };

    it('shows the icon the merchant picked', () => {
      mockIconNames = ['merchant-icon', 'tab-icon', 'action-icon'];

      expect(renderIconSlot('merchant-icon')?.querySelector('svg'))
        .toHaveAttribute('data-icon', 'merchant-icon');
    });

    it('prefers the icon of the tab details to the one of the resolved action', () => {
      mockIconNames = ['tab-icon', 'action-icon'];

      expect(renderIconSlot('unknown')?.querySelector('svg'))
        .toHaveAttribute('data-icon', 'tab-icon');
    });

    it('falls back to the icon of the resolved action', () => {
      mockIconNames = ['action-icon'];

      expect(renderIconSlot('unknown')?.querySelector('svg'))
        .toHaveAttribute('data-icon', 'action-icon');
    });

    it('keeps an empty icon slot when no icon resolves', () => {
      const slot = renderIconSlot();

      expect(slot).toBeInTheDocument();
      expect(slot).toBeEmptyDOMElement();
    });
  });
});
