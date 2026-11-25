import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import type { FooterBarVariant, NavigationActionSettings } from '@shopgate/engage/settings/types/appSettings';
import { registerNavigationAction } from '@shopgate/engage/navigation/registry';
import type { NavigationActionHook } from '@shopgate/engage/navigation/types';
import { useScrollDirectionChange } from '@shopgate/engage/core/hooks';
import {
  resolveTabBarItems,
  useFooterBarLayout,
  useTabBarItems,
  useTabBarScrollObserver,
} from './hooks';

let mockTabBarVariant = 'fixed';
let mockTabBarItems: NavigationActionSettings[] | undefined;

jest.mock('react-redux', () => ({ useSelector: (selector: () => unknown) => selector() }));
jest.mock('@shopgate/engage/settings/selectors/appSettings', () => ({
  getAreAppSettingsHydrated: () => true,
  getTabBarSettings: () => ({
    variant: mockTabBarVariant,
    transition: 'fade',
    hideOnScroll: false,
    showLabels: true,
    fixed: { borderEnabled: true },
  }),
  getTabBarItems: () => mockTabBarItems,
}));
jest.mock('@shopgate/engage/navigation/actions', () => ({
  CORE_NAVIGATION_ACTIONS: {
    openSearch: () => null,
    cart: () => null,
  },
}));
jest.mock('@shopgate/engage/core/hooks', () => ({
  useWidgetSettings: () => ({}),
  useScrollDirectionChange: jest.fn(),
}));
jest.mock('@shopgate/engage', () => ({ themeConfig: { variables: {} } }));

/**
 * Renders the resolved layout as text.
 * @param props The component props.
 * @param props.variant The configured variant of the bar.
 * @returns The layout.
 */
const Layout = ({ variant }: { variant: FooterBarVariant }) => {
  const layout = useFooterBarLayout(variant);
  return <span>{`${layout.variant} ${layout.gap}`}</span>;
};

/**
 * Runs the scroll observer of the tab bar.
 * @returns Nothing.
 */
const ScrollObserver = () => {
  useTabBarScrollObserver(true);
  return null;
};

describe('useTabBarScrollObserver()', () => {
  it('reports every scroll past the offset, since a route change shows the tab bar again', () => {
    render(<ScrollObserver />);

    expect(useScrollDirectionChange).toHaveBeenCalledWith(expect.objectContaining({
      onlyFireOnDirectionChange: false,
    }));
  });
});

describe('useFooterBarLayout()', () => {
  it('keeps the configured variant above a fixed tab bar', () => {
    mockTabBarVariant = 'fixed';
    const { rerender } = render(<Layout variant="fixed" />);
    expect(screen.getByText('fixed 16')).toBeInTheDocument();

    rerender(<Layout variant="floating" />);
    expect(screen.getByText('floating 16')).toBeInTheDocument();
  });

  it('makes the bar float above a floating tab bar', () => {
    mockTabBarVariant = 'floating';
    render(<Layout variant="fixed" />);

    expect(screen.getByText('floating 8')).toBeInTheDocument();
  });
});

/**
 * Creates a configured tab bar item.
 * @param action The action of the item.
 * @param icon The icon of the item.
 * @returns The item.
 */
const item = (action: string, icon = ''): NavigationActionSettings => ({
  action,
  icon,
  link: '',
});

/**
 * Lists the actions of items.
 * @param items The items.
 * @returns The actions.
 */
const actions = (items: readonly NavigationActionSettings[]) => items.map(({ action }) => action);

const useTestAction: NavigationActionHook = () => ({
  available: true,
  icon: '',
  label: 'test',
  onClick: jest.fn(),
});

registerNavigationAction('@shopgate/test/card', useTestAction, {
  tabBar: {
    label: 'Card',
    icon: '',
  },
});
registerNavigationAction('@shopgate/test/card2', useTestAction, {
  tabBar: {
    label: 'Card 2',
    icon: '',
  },
});
registerNavigationAction('@shopgate/test/unlabeled', useTestAction, {
  tabBar: {
    label: '',
    icon: '',
  },
});
registerNavigationAction('@shopgate/test/header', useTestAction);
registerNavigationAction('openSearch', useTestAction, {
  tabBar: {
    label: 'Search',
    icon: '',
  },
});

describe('resolveTabBarItems()', () => {
  it('uses the default items without a stored list', () => {
    expect(actions(resolveTabBarItems(undefined))).toEqual(['home', 'browse', 'cart', 'favorites', 'more']);
  });

  it('keeps the stored order and the configured icons', () => {
    const items = resolveTabBarItems([item('home'), item('cart', 'star'), item('categoryDrawer')]);

    expect(items).toEqual([item('home'), item('cart', 'star'), item('categoryDrawer')]);
  });

  it('drops none, unknown actions and actions without a tab', () => {
    const items = resolveTabBarItems([
      item('home'), item('none'), item('@shopgate/test/unknown'), item('@shopgate/test/header'), item('more'),
    ]);

    expect(actions(items)).toEqual(['home', 'more']);
  });

  it('keeps an extension action whose tab has an empty label', () => {
    expect(actions(resolveTabBarItems([item('home'), item('@shopgate/test/unlabeled')])))
      .toEqual(['home', '@shopgate/test/unlabeled']);
  });

  it('drops a core header action even when it was registered with a tab', () => {
    expect(actions(resolveTabBarItems([item('home'), item('openSearch')]))).toEqual(['home']);
  });

  it('keeps only the first item of each tab', () => {
    expect(actions(resolveTabBarItems([item('home'), item('cart', 'star'), item('cart')])))
      .toEqual(['home', 'cart']);
    expect(resolveTabBarItems([item('home'), item('cart', 'star'), item('cart')])[1]).toEqual(item('cart', 'star'));
    expect(actions(resolveTabBarItems([item('home'), item('browse'), item('categoryDrawer')])))
      .toEqual(['home', 'browse']);
    expect(actions(resolveTabBarItems([item('home'), item('@shopgate/test/card'), item('@shopgate/test/card')])))
      .toEqual(['home', '@shopgate/test/card']);
  });

  it('adds Home in front when it is missing', () => {
    expect(resolveTabBarItems([item('cart'), item('more')])).toEqual([item('home'), item('cart'), item('more')]);
    expect(actions(resolveTabBarItems([]))).toEqual(['home']);
  });

  it('keeps at most six items', () => {
    const items = resolveTabBarItems([
      item('cart'), item('browse'), item('favorites'), item('more'), item('@shopgate/test/card'), item('home'),
      item('@shopgate/test/card2'),
    ]);

    expect(actions(items)).toEqual(['cart', 'browse', 'favorites', 'more', '@shopgate/test/card', 'home']);
  });

  it('adds Home in front when the list is full without it', () => {
    const items = resolveTabBarItems([
      item('cart'), item('browse'), item('favorites'), item('more'), item('@shopgate/test/card'), item('categoryDrawer'),
    ]);

    expect(actions(items)).toEqual(['home', 'cart', 'browse', 'favorites', 'more', '@shopgate/test/card']);
  });

  it('moves a stored Home beyond the limit to the front', () => {
    const items = resolveTabBarItems([
      item('cart'), item('favorites'), item('more'), item('@shopgate/test/card'), item('@shopgate/test/card2'),
      item('categoryDrawer'), item('home', 'star'),
    ]);

    expect(items[0]).toEqual(item('home', 'star'));
    expect(actions(items)).toEqual(['home', 'cart', 'favorites', 'more', '@shopgate/test/card', '@shopgate/test/card2']);
  });

  it('renders a registered item only when it is stored', () => {
    expect(actions(resolveTabBarItems(undefined))).not.toContain('@shopgate/test/card');
    expect(actions(resolveTabBarItems([item('home'), item('@shopgate/test/card')])))
      .toEqual(['home', '@shopgate/test/card']);
  });
});

/**
 * Renders the actions of the resolved tab bar items.
 * @returns The actions.
 */
const Items = () => <span>{actions(useTabBarItems()).join(' ')}</span>;

describe('useTabBarItems()', () => {
  it('resolves the stored items of the app settings', () => {
    mockTabBarItems = undefined;
    const { rerender } = render(<Items />);
    expect(screen.getByText('home browse cart favorites more')).toBeInTheDocument();

    mockTabBarItems = [item('more'), item('none')];
    rerender(<Items />);
    expect(screen.getByText('home more')).toBeInTheDocument();
  });

  it('hands out frozen copies of the stored items', () => {
    const stored = [item('home'), item('cart', 'star')];
    mockTabBarItems = stored;
    let items: readonly NavigationActionSettings[] = [];

    /**
     * Keeps the resolved items.
     * @returns Nothing.
     */
    const Capture = () => {
      items = useTabBarItems();
      return null;
    };

    render(<Capture />);

    expect(Object.isFrozen(items)).toBe(true);
    expect(items).toEqual(stored);
    items.forEach((resolved, index) => {
      expect(Object.isFrozen(resolved)).toBe(true);
      expect(resolved).not.toBe(stored[index]);
    });
    expect(() => {
      (items[1] as NavigationActionSettings).icon = 'heart';
    }).toThrow(TypeError);
    expect(stored[1].icon).toBe('star');
  });

  it('keeps the same list while the stored items stay the same', () => {
    mockTabBarItems = [item('home'), item('cart')];
    const results: Array<readonly NavigationActionSettings[]> = [];

    /**
     * Keeps the resolved items of every render.
     * @returns Nothing.
     */
    const Capture = () => {
      results.push(useTabBarItems());
      return null;
    };

    const { rerender } = render(<Capture />);
    rerender(<Capture />);

    expect(results).toHaveLength(2);
    expect(results[1]).toBe(results[0]);
  });
});
