import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { registerNavigationAction } from '@shopgate/engage/navigation/registry';
import type { ResolvedNavigationAction } from '@shopgate/engage/navigation/types';
import ExtensionAction from './index';

jest.mock('@shopgate/engage/components', () => ({
  I18n: { Text: ({ string }: { string: string }) => string },
  Badge: jest.requireActual('@shopgate/engage/components/Badge').default,
}));
jest.mock('@shopgate/engage/navigation/actions', () => ({ CORE_NAVIGATION_ACTIONS: {} }));
jest.mock('../../../../helpers/actionIcons', () => ({ getActionIcon: () => null }));
jest.mock('../../hooks', () => ({ useTabBarSettings: () => mockTabBarSettings }));

let mockAction: Partial<ResolvedNavigationAction> = {};
let mockTabBarSettings: { showLabels?: boolean } = {};

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
  });

  it('shows the count and announces it with the label', () => {
    const tab = renderTab({ badgeCount: 3 });

    expect(getBadge(tab)).toHaveTextContent('3');
    expect(tab).toHaveAttribute('aria-label', 'Card, 3');
  });

  it('shows counts above 99 as 99+ and announces the exact count', () => {
    const tab = renderTab({ badgeCount: 120 });

    expect(getBadge(tab)).toHaveTextContent('99+');
    expect(tab).toHaveAttribute('aria-label', 'Card, 120');
  });

  it('caps the count at the maximum of the action', () => {
    const tab = renderTab({
      badgeCount: 12,
      badgeMax: 9,
    });

    expect(getBadge(tab)).toHaveTextContent('9+');
  });

  it('shows a dot without a number in dot mode, named by the label', () => {
    const tab = renderTab({
      badgeCount: 2,
      badgeShowCount: false,
    });

    expect(getBadge(tab)).toBeInTheDocument();
    expect(getBadge(tab)).toBeEmptyDOMElement();
    expect(tab).toHaveAttribute('aria-label', 'Card');
  });

  it('shows no dot in dot mode while the count is 0', () => {
    const tab = renderTab({
      badgeCount: 0,
      badgeShowCount: false,
    });

    expect(getBadge(tab)).not.toBeInTheDocument();
  });

  it.each([true, false])('names the tab by the badge label of the action (showCount %j)', (badgeShowCount) => {
    const tab = renderTab({
      badgeCount: 3,
      badgeShowCount,
      badgeLabel: 'Card, 3 new',
    });

    expect(getBadge(tab)).toBeInTheDocument();
    expect(tab).toHaveAttribute('aria-label', 'Card, 3 new');
  });

  it.each([undefined, 0, -2])('has no badge and is named by the label with the count %j', (badgeCount) => {
    const tab = renderTab({
      badgeCount,
      badgeLabel: 'Card, nothing new',
    });

    expect(getBadge(tab)).not.toBeInTheDocument();
    expect(tab).toHaveAttribute('aria-label', 'Card');
  });

  it('keeps its accessible name while the tab bar hides the labels', () => {
    mockTabBarSettings = { showLabels: false };
    const tab = renderTab({});

    expect(tab).not.toHaveTextContent('Card');
    expect(tab).toHaveAccessibleName('Card');
  });
});
