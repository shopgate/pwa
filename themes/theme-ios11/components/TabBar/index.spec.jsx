/* eslint-disable react/prop-types */
import {
  render, screen, act, fireEvent, within,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import portalCollection from '@shopgate/pwa-common/helpers/portals/portalCollection';
import { setCSSCustomProp } from '@shopgate/engage/styles/helpers';
import { useElementSize } from '@shopgate/engage/core/hooks';
import { UIEvents } from '@shopgate/engage/core/events';
import { OPEN_CATEGORY_DRAWER, registerNavigationAction } from '@shopgate/engage/navigation';
import {
  TAB_HOME,
  TAB_BROWSE,
  TAB_CART,
  TAB_MORE,
  TAB_FAVORITES,
  HIDE_TAB_BAR,
  TAB_BAR_CART_AFTER,
  TAB_BAR_CART_BEFORE,
  TAB_BAR_CART,
  TAB_BAR_BROWSE_BEFORE,
  TAB_BAR_BROWSE,
  TAB_BAR_BROWSE_AFTER,
} from './constants';
import TabBarActionComponent from './components/TabBarAction';
import { useTabBarItems, useTabBarSettings, useTabBarScrollObserver } from './hooks';
import TabBar from './index';

let mockKeyboardOpen = false;
const mockNavigate = jest.fn();

jest.mock('@shopgate/engage/components', () => ({
  KeyboardConsumer: ({ children }) => children({ open: mockKeyboardOpen }),
  SurroundPortals: ({ children }) => children,
  I18n: { Text: ({ string }) => string },
  Badge: ({ count }) => (count ? <span>{count}</span> : null),
}));
jest.mock('@shopgate/engage/navigation/actions', () => ({ CORE_NAVIGATION_ACTIONS: {} }));
jest.mock('@shopgate/engage/core/hooks', () => ({
  useElementSize: jest.fn(),
}));
jest.mock('@shopgate/engage/styles/helpers', () => ({
  setCSSCustomProp: jest.fn(),
}));
jest.mock('../../helpers/actionIcons', () => {
  const icons = {
    star: () => <svg data-testid="star-icon" />,
    'card-icon': () => <svg data-testid="card-icon" />,
  };
  return { getActionIcon: name => icons[name] ?? null };
});
jest.mock('./connector', () => Component => Component);
jest.mock('./hooks', () => ({
  useTabBarSettings: jest.fn(),
  useTabBarScrollObserver: jest.fn(),
  useTabBarItems: jest.fn(),
}));
jest.mock('./components/connector', () => Component => props => (
  <Component historyPush={mockNavigate} {...props} />
));
jest.mock('./components/CartAction/components/CartItemBadge/connector', () => Component => props => (
  <Component cartProductCount={0} {...props} />
));
jest.mock('./components/FavoritesAction/components/FavoritesIconBadge/connector', () => Component => props => (
  <Component favoritesCount={0} showWishlistItemsCountBadge {...props} />
));
jest.mock('./components/FavoritesAction/hooks', () => ({
  useShowFavoritesCounter: () => true,
}));

const allTabs = [TAB_HOME, TAB_BROWSE, TAB_CART, TAB_FAVORITES, TAB_MORE];

const item = (action, icon = '') => ({
  action,
  icon,
  link: '',
});

const defaultItems = allTabs.map(action => item(action));

const props = {
  path: '/',
  modalCount: 0,
};

let mockCardActive = false;
const mockCardClick = jest.fn();

registerNavigationAction('@shopgate/test/card', () => ({
  available: true,
  icon: '',
  label: 'card.action',
  onClick: mockCardClick,
  isActive: mockCardActive,
  badgeCount: 3,
}), {
  tabBar: {
    label: 'Card',
    icon: 'card-icon',
  },
});

/**
 * A legacy portal extension that adds a tab after the cart.
 * @param {Object} props The portal props.
 * @returns {JSX.Element}
 */
const CustomerCardPortal = ({ TabBarAction, path }) => (
  <TabBarAction label="Customer card" isHighlighted={path === '/card'} />
);

/**
 * Registers portal components.
 * @param {Object} targets The components by portal name.
 */
const registerPortals = (targets) => {
  const names = Object.keys(targets);
  portalCollection.registerPortals(Object.fromEntries(names.map(name => [`@shopgate/test/${name}`, targets[name]])));
  portalCollection.registerConfig(Object.fromEntries(names.map(name => [`@shopgate/test/${name}`, { target: name }])));
};

/**
 * Creates a portal component that records its props and renders nothing.
 * @returns {Function}
 */
const createPortalSpy = () => jest.fn(() => null);

/**
 * Returns the props a portal component received last, without the props of the Portal itself.
 * @param {Function} spy The portal component.
 * @returns {Object}
 */
const getPortalProps = (spy) => {
  const { name, children, ...portalProps } = spy.mock.calls[spy.mock.calls.length - 1][0];
  return portalProps;
};

const TAB_ITEM_PROPS = ['configuredIcon', 'portalsOnly', 'opensCategoryDrawer'];

const TAB_BAR_ACTION_DEFAULTS = {
  'aria-hidden': null,
  'aria-label': null,
  icon: null,
  onClick: null,
  tabIndex: null,
};

describe('<TabBar />', () => {
  /**
   * @returns {HTMLElement} The tab list, no matter if it's hidden.
   */
  const getTabList = () => screen.getByRole('tablist', { hidden: true });

  /**
   * @returns {string[]} The labels of the rendered tabs.
   */
  const getTabLabels = () => screen.getAllByRole('tab').map(tab => tab.textContent);

  beforeEach(() => {
    jest.clearAllMocks();
    mockKeyboardOpen = false;
    mockCardActive = false;
    portalCollection.registerPortals({});
    portalCollection.registerConfig({});
    useTabBarSettings.mockReturnValue({});
    useTabBarItems.mockReturnValue(defaultItems);
    useElementSize.mockReturnValue({ height: 49 });
  });

  it('should render when visible', () => {
    render(<TabBar {...props} />);

    expect(screen.getByRole('tablist')).toBeVisible();
    expect(getTabLabels()).toEqual(allTabs.map(type => `tab_bar.${type}`));
    expect(useTabBarScrollObserver).toHaveBeenCalledWith(true);
    expect(setCSSCustomProp).toHaveBeenLastCalledWith('--tabbar-height', '49px');
  });

  it('should not be visible when invisible', () => {
    render(<TabBar {...props} isVisible={false} />);

    expect(getTabList()).not.toBeVisible();
    expect(useTabBarScrollObserver).toHaveBeenCalledWith(false);
    expect(setCSSCustomProp).toHaveBeenLastCalledWith('--tabbar-height', '0px');
  });

  it('should be hidden while the keyboard is open', () => {
    mockKeyboardOpen = true;

    render(<TabBar {...props} />);

    expect(getTabList()).not.toBeVisible();
  });

  it('should not hide on scroll in the cart', () => {
    render(<TabBar {...props} activeTab={TAB_CART} path="/cart" />);

    expect(useTabBarScrollObserver).toHaveBeenCalledWith(false);
  });

  it('should show a scrolled out tab bar again after a route change', () => {
    useTabBarSettings.mockReturnValue({
      hideOnScroll: true,
      transition: 'slide',
    });
    const { container, rerender } = render(<TabBar {...props} path="/item/1" />);
    const tabBar = container.querySelector('.theme__tab-bar__container');

    act(() => { UIEvents.emit(HIDE_TAB_BAR, { scroll: true }); });
    expect(tabBar).toHaveClass('transition-hidden');

    rerender(<TabBar {...props} path="/cart" />);
    expect(tabBar).toHaveClass('transition-visible');
  });

  it.each(allTabs)('should highlight the active tab "%s"', (activeTab) => {
    render(<TabBar {...props} activeTab={activeTab} />);

    expect(screen.getAllByRole('tab', { selected: true })).toHaveLength(1);
    expect(screen.getByRole('tab', { selected: true })).toHaveTextContent(`tab_bar.${activeTab}`);
  });

  it('should not highlight a tab without an active tab', () => {
    render(<TabBar {...props} />);

    expect(screen.queryByRole('tab', { selected: true })).not.toBeInTheDocument();
  });

  it('should be hidden from assistive technology while a modal is open', () => {
    const { rerender } = render(<TabBar {...props} modalCount={1} />);

    expect(getTabList()).toHaveAttribute('aria-hidden', 'true');

    rerender(<TabBar {...props} modalCount={0} />);

    expect(getTabList()).toHaveAttribute('aria-hidden', 'false');
  });

  it('should hide and show via the static methods', () => {
    render(<TabBar {...props} />);

    act(() => { TabBar.hide(); });
    expect(getTabList()).not.toBeVisible();
    expect(setCSSCustomProp).toHaveBeenLastCalledWith('--tabbar-height', '0px');

    act(() => { TabBar.show(); });
    expect(getTabList()).toBeVisible();
    expect(setCSSCustomProp).toHaveBeenLastCalledWith('--tabbar-height', '49px');
  });

  it('should only show a disabled tab bar when forced', () => {
    render(<TabBar {...props} isEnabled={false} isVisible={false} />);

    act(() => { TabBar.show(); });
    expect(getTabList()).not.toBeVisible();

    act(() => { TabBar.show(true); });
    expect(getTabList()).toBeVisible();
  });

  it('should apply the variant of the settings', () => {
    const { container, rerender } = render(<TabBar {...props} />);
    const tabBar = container.querySelector('.theme__tab-bar__container');

    expect(tabBar).toHaveClass('variant-fixed', 'variant-docked');
    expect(tabBar).not.toHaveClass('variant-floating');

    useTabBarSettings.mockReturnValue({ variant: 'floating' });
    rerender(<TabBar {...props} path="/other" />);

    expect(tabBar).toHaveClass('variant-floating');
    expect(tabBar).not.toHaveClass('variant-fixed', 'variant-docked');
  });

  it('should render the configured items in their order with the tab labels', () => {
    useTabBarItems.mockReturnValue([item('home'), item('more'), item('cart')]);

    render(<TabBar {...props} />);

    expect(getTabLabels()).toEqual(['tab_bar.home', 'tab_bar.more', 'tab_bar.cart']);
  });

  it('should navigate through the tab memory when a tab is clicked', () => {
    render(<TabBar {...props} />);

    fireEvent.click(screen.getAllByRole('tab')[1]);

    expect(mockNavigate).toHaveBeenCalledWith({ pathname: '/browse' });
  });

  it('should render the merchant icon instead of the default icon', () => {
    useTabBarItems.mockReturnValue([item('home', 'star'), item('cart', 'unknown')]);

    render(<TabBar {...props} />);
    const [home, cart] = screen.getAllByRole('tab');

    expect(within(home).getByTestId('star-icon')).toBeInTheDocument();
    expect(within(cart).queryByTestId('star-icon')).not.toBeInTheDocument();
    expect(cart.querySelector('svg')).toBeInTheDocument();
  });

  it('should open the category drawer from a categoryDrawer item, highlighted like Browse', () => {
    const handleOpen = jest.fn();
    UIEvents.addListener(OPEN_CATEGORY_DRAWER, handleOpen);
    useTabBarItems.mockReturnValue([item('home'), item('categoryDrawer')]);

    render(<TabBar {...props} activeTab={TAB_BROWSE} />);
    const tab = screen.getByRole('tab', { selected: true });
    fireEvent.click(tab);
    UIEvents.removeListener(OPEN_CATEGORY_DRAWER, handleOpen);

    expect(tab).toHaveTextContent('tab_bar.browse');
    expect(handleOpen).toHaveBeenCalledTimes(1);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should render the after portal of a deleted Cart at the end', () => {
    registerPortals({ [TAB_BAR_CART_AFTER]: CustomerCardPortal });
    useTabBarItems.mockReturnValue([item('home'), item('browse'), item('more')]);

    render(<TabBar {...props} path="/card" />);

    expect(getTabLabels()).toEqual(['tab_bar.home', 'tab_bar.browse', 'tab_bar.more', 'Customer card']);
    expect(screen.getByRole('tab', { selected: true })).toHaveTextContent('Customer card');
  });

  it('should render the after portal of the Cart next to it while Cart is configured', () => {
    registerPortals({ [TAB_BAR_CART_AFTER]: CustomerCardPortal });
    useTabBarItems.mockReturnValue([item('home'), item('cart'), item('more')]);

    render(<TabBar {...props} />);

    expect(getTabLabels()).toEqual(['tab_bar.home', 'tab_bar.cart', 'Customer card', 'tab_bar.more']);
  });

  it('should render a registered extension item, highlighted while its action is active', () => {
    useTabBarItems.mockReturnValue([item('home'), item('@shopgate/test/card')]);

    const { rerender } = render(<TabBar {...props} />);
    const card = screen.getAllByRole('tab')[1];

    expect(card).toHaveTextContent('Card');
    expect(card).toHaveTextContent('3');
    expect(card).toHaveAttribute('aria-selected', 'false');

    fireEvent.click(card);
    expect(mockCardClick).toHaveBeenCalledTimes(1);

    mockCardActive = true;
    rerender(<TabBar {...props} path="/card" />);

    expect(screen.getByRole('tab', { selected: true })).toHaveTextContent('Card');
  });

  it('should pass the legacy props to the cart portals', () => {
    const before = createPortalSpy();
    const main = createPortalSpy();
    const after = createPortalSpy();
    registerPortals({
      [TAB_BAR_CART_BEFORE]: before,
      [TAB_BAR_CART]: main,
      [TAB_BAR_CART_AFTER]: after,
    });
    useTabBarItems.mockReturnValue([item('home'), item('cart', 'star')]);

    render(<TabBar {...props} activeTab={TAB_CART} path="/cart" />);
    const expected = {
      ...TAB_BAR_ACTION_DEFAULTS,
      type: TAB_CART,
      label: 'tab_bar.cart',
      isHighlighted: true,
      path: '/cart',
      historyPush: mockNavigate,
      cartProductCount: 0,
    };

    expect(getPortalProps(before)).toEqual(expected);
    expect(getPortalProps(main)).toEqual({
      ...expected,
      TabBarAction: TabBarActionComponent,
    });
    expect(getPortalProps(after)).toEqual({
      ...expected,
      TabBarAction: TabBarActionComponent,
    });
    [before, main, after].forEach((spy) => {
      TAB_ITEM_PROPS.forEach((name) => {
        expect(getPortalProps(spy)).not.toHaveProperty(name);
      });
    });
  });

  it('should pass the legacy props to the browse portals of a categoryDrawer item', () => {
    const before = createPortalSpy();
    const main = createPortalSpy();
    const after = createPortalSpy();
    registerPortals({
      [TAB_BAR_BROWSE_BEFORE]: before,
      [TAB_BAR_BROWSE]: main,
      [TAB_BAR_BROWSE_AFTER]: after,
    });
    useTabBarItems.mockReturnValue([item('home'), item('categoryDrawer')]);

    render(<TabBar {...props} />);
    const expected = {
      ...TAB_BAR_ACTION_DEFAULTS,
      type: TAB_BROWSE,
      label: 'tab_bar.browse',
      isHighlighted: false,
      path: '/',
      historyPush: mockNavigate,
      TabBarAction: TabBarActionComponent,
    };

    [before, main, after].forEach((spy) => {
      expect(spy).toHaveBeenCalledTimes(1);
      expect(getPortalProps(spy)).toEqual(expected);
      TAB_ITEM_PROPS.forEach((name) => {
        expect(getPortalProps(spy)).not.toHaveProperty(name);
      });
    });
  });

  it('should not render the browse portals again for a categoryDrawer item', () => {
    registerPortals({ [TAB_BAR_BROWSE_AFTER]: CustomerCardPortal });
    useTabBarItems.mockReturnValue([item('home'), item('categoryDrawer'), item('more')]);

    render(<TabBar {...props} />);

    expect(getTabLabels()).toEqual(['tab_bar.home', 'tab_bar.browse', 'Customer card', 'tab_bar.more']);
  });

  it('should render the browse portals at the end without a browse item', () => {
    registerPortals({ [TAB_BAR_BROWSE_AFTER]: CustomerCardPortal });
    useTabBarItems.mockReturnValue([item('home'), item('more')]);

    render(<TabBar {...props} />);

    expect(getTabLabels()).toEqual(['tab_bar.home', 'tab_bar.more', 'Customer card']);
  });

  it.each([
    ['star', 'star-icon'],
    ['', 'card-icon'],
    ['unknown', 'card-icon'],
  ])('should render the icon %j of a registered extension item as %s', (icon, testId) => {
    useTabBarItems.mockReturnValue([item('home'), item('@shopgate/test/card', icon)]);

    render(<TabBar {...props} />);
    const card = screen.getAllByRole('tab')[1];

    expect(within(card).getByTestId(testId)).toBeInTheDocument();
    expect(within(card).getAllByTestId(/-icon$/)).toHaveLength(1);
  });
});
/* eslint-enable react/prop-types */
