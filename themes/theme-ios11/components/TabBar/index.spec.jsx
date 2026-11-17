/* eslint-disable react/prop-types */
import {
  render as renderComponent, screen, act, fireEvent, within,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { getCartProductCount } from '@shopgate/pwa-common-commerce/cart/selectors';
import { getFavoritesCount } from '@shopgate/pwa-common-commerce/favorites/selectors';
import { getShowWishlistItemsCountBadge } from '@shopgate/engage/settings/selectors/shopSettings';
import { hasNewServices } from '@shopgate/engage/core/helpers/environment';
import portalCollection from '@shopgate/pwa-common/helpers/portals/portalCollection';
import { setCSSCustomProp } from '@shopgate/engage/styles/helpers';
import { useElementSize } from '@shopgate/engage/core/hooks';
import { UIEvents } from '@shopgate/engage/core/events';
import { SurroundPortals } from '@shopgate/engage/components';
import { OPEN_CATEGORY_DRAWER, registerNavigationAction } from '@shopgate/engage/navigation';
import {
  TAB_HOME,
  TAB_BROWSE,
  TAB_CART,
  TAB_MORE,
  TAB_FAVORITES,
  HIDE_TAB_BAR,
  TAB_BAR,
  TAB_BAR_CART_AFTER,
  TAB_BAR_CART_BEFORE,
  TAB_BAR_CART,
  TAB_BAR_BROWSE_BEFORE,
  TAB_BAR_BROWSE,
  TAB_BAR_BROWSE_AFTER,
  TAB_BAR_FAVORITES_BEFORE,
  TAB_BAR_FAVORITES,
  TAB_BAR_FAVORITES_AFTER,
  TAB_BAR_HOME_BEFORE,
  TAB_BAR_HOME,
  TAB_BAR_HOME_AFTER,
} from './constants';
import TabBarActionComponent from './components/TabBarAction';
import { useShowFavoritesCounter } from './components/FavoritesIconBadge/hooks';
import { tabs } from './helpers/getTabActionComponentForType';
import { useTabBarItems, useTabBarSettings, useTabBarScrollObserver } from './hooks';
import TabBar from './index';

let mockKeyboardOpen = false;
const mockNavigate = jest.fn(params => ({
  type: 'NAVIGATE',
  params,
}));

jest.mock('@shopgate/engage/components', () => ({
  KeyboardConsumer: ({ children }) => children({ open: mockKeyboardOpen }),
  SurroundPortals: jest.fn(({ children }) => children),
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
jest.mock('./components/actions', () => ({
  navigate: params => mockNavigate(params),
}));
jest.mock('@shopgate/pwa-common-commerce/cart/selectors', () => ({
  ...jest.requireActual('@shopgate/pwa-common-commerce/cart/selectors'),
  getCartProductCount: jest.fn(() => 0),
}));
jest.mock('@shopgate/pwa-common-commerce/favorites/selectors', () => ({
  ...jest.requireActual('@shopgate/pwa-common-commerce/favorites/selectors'),
  getFavoritesCount: jest.fn(() => 0),
}));
jest.mock('@shopgate/engage/settings/selectors/shopSettings', () => ({
  ...jest.requireActual('@shopgate/engage/settings/selectors/shopSettings'),
  getShowWishlistItemsCountBadge: jest.fn(() => true),
}));
jest.mock('@shopgate/engage/core/helpers/environment', () => ({
  ...jest.requireActual('@shopgate/engage/core/helpers/environment'),
  hasNewServices: jest.fn(() => false),
}));
jest.mock('./components/FavoritesIconBadge/hooks', () => ({
  useShowFavoritesCounter: jest.fn(() => true),
}));

const mockStore = configureStore();
let store;

/**
 * Renders a component within a redux store.
 * @param {JSX.Element} ui The component.
 * @returns {Object} The render result.
 */
const render = ui => renderComponent(ui, {
  wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
});

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
    store = mockStore({});
    getCartProductCount.mockReturnValue(0);
    getFavoritesCount.mockReturnValue(0);
    getShowWishlistItemsCountBadge.mockReturnValue(true);
    useShowFavoritesCounter.mockReturnValue(true);
    hasNewServices.mockReturnValue(false);
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

  it('should call navigate with the tab path when a tab is clicked', () => {
    render(<TabBar {...props} />);

    fireEvent.click(screen.getAllByRole('tab')[1]);

    expect(mockNavigate).toHaveBeenCalledWith({ pathname: '/browse' });
  });

  it('should pass the resolved items to the tab bar portals', () => {
    const items = [item('home'), item('categoryDrawer'), item('@shopgate/test/card')];
    useTabBarItems.mockReturnValue(items);

    render(<TabBar {...props} activeTab={TAB_HOME} />);

    const [{ portalProps }] = SurroundPortals.mock.calls
      .find(([{ portalName }]) => portalName === TAB_BAR);

    expect(portalProps).toEqual({
      tabs,
      isVisible: true,
      activeTab: TAB_HOME,
      path: '/',
      items,
    });
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
      historyPush: expect.any(Function),
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
      historyPush: expect.any(Function),
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

  it('should dispatch the navigate action through the historyPush of the portal props', () => {
    const main = createPortalSpy();
    registerPortals({ [TAB_BAR_CART]: main });

    render(<TabBar {...props} />);
    getPortalProps(main).historyPush({ pathname: '/cart' });

    expect(mockNavigate).toHaveBeenCalledWith({ pathname: '/cart' });
    expect(store.getActions()).toEqual([{
      type: 'NAVIGATE',
      params: { pathname: '/cart' },
    }]);
  });

  it('should pass the legacy props to the favorites portals', () => {
    const before = createPortalSpy();
    const main = createPortalSpy();
    const after = createPortalSpy();
    registerPortals({
      [TAB_BAR_FAVORITES_BEFORE]: before,
      [TAB_BAR_FAVORITES]: main,
      [TAB_BAR_FAVORITES_AFTER]: after,
    });
    useTabBarItems.mockReturnValue([item('home'), item('favorites', 'star')]);

    render(<TabBar {...props} activeTab={TAB_FAVORITES} path="/favorites" />);
    const expected = {
      ...TAB_BAR_ACTION_DEFAULTS,
      type: TAB_FAVORITES,
      label: 'tab_bar.favorites',
      isHighlighted: true,
      path: '/favorites',
      historyPush: expect.any(Function),
      favoritesCount: 0,
      showWishlistItemsCountBadge: true,
      widgetSettings: { showCounter: true },
      TabBarAction: TabBarActionComponent,
    };

    [before, main, after].forEach((spy) => {
      expect(getPortalProps(spy)).toEqual(expected);
      TAB_ITEM_PROPS.forEach((name) => {
        expect(getPortalProps(spy)).not.toHaveProperty(name);
      });
    });
  });

  it('should pass the legacy props to the home portals', () => {
    const before = createPortalSpy();
    const main = createPortalSpy();
    const after = createPortalSpy();
    registerPortals({
      [TAB_BAR_HOME_BEFORE]: before,
      [TAB_BAR_HOME]: main,
      [TAB_BAR_HOME_AFTER]: after,
    });

    render(<TabBar {...props} activeTab={TAB_HOME} />);
    const expected = {
      ...TAB_BAR_ACTION_DEFAULTS,
      type: TAB_HOME,
      label: 'tab_bar.home',
      isHighlighted: true,
      path: '/',
      historyPush: expect.any(Function),
      TabBarAction: TabBarActionComponent,
    };

    [before, main, after].forEach((spy) => {
      expect(getPortalProps(spy)).toEqual(expected);
      TAB_ITEM_PROPS.forEach((name) => {
        expect(getPortalProps(spy)).not.toHaveProperty(name);
      });
    });

    const { children } = main.mock.calls[main.mock.calls.length - 1][0];
    expect(children.props.historyPush).toBe(getPortalProps(main).historyPush);
  });

  it('should label the cart and favorites tabs with their counts', () => {
    getCartProductCount.mockReturnValue(2);

    render(<TabBar {...props} />);
    const [home, , cart, favorites] = screen.getAllByRole('tab');

    expect(home).not.toHaveAttribute('aria-label');
    expect(cart).toHaveAttribute('aria-label', 'tab_bar.cart. common.products: 2.');
    expect(within(cart).getByText('2')).toBeInTheDocument();
    expect(favorites).toHaveAttribute('aria-label', 'tab_bar.favorites. common.products: 0. ');
  });

  it('should render only the before and after portals without a tab when portalsOnly is set', () => {
    const before = createPortalSpy();
    const main = createPortalSpy();
    const after = createPortalSpy();
    registerPortals({
      [TAB_BAR_CART_BEFORE]: before,
      [TAB_BAR_CART]: main,
      [TAB_BAR_CART_AFTER]: after,
    });
    const Cart = tabs[TAB_CART];

    render(<Cart type={TAB_CART} label="tab_bar.cart" path="/" portalsOnly />);

    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
    expect(before).toHaveBeenCalled();
    expect(after).toHaveBeenCalled();
    expect(main).not.toHaveBeenCalled();
  });

  it('should render a working tab from the tabs map with the legacy props only', () => {
    getCartProductCount.mockReturnValue(3);
    const Cart = tabs[TAB_CART];

    render(<Cart type={TAB_CART} label="tab_bar.cart" isHighlighted path="/cart" />);
    const tab = screen.getByRole('tab', { selected: true });
    fireEvent.click(tab);

    expect(tab).toHaveTextContent('tab_bar.cart');
    expect(tab).toHaveAttribute('data-type', TAB_CART);
    expect(tab).toHaveAttribute('aria-label', 'tab_bar.cart. common.products: 3.');
    expect(within(tab).getByText('3')).toBeInTheDocument();
    expect(tab.querySelector('svg')).toBeInTheDocument();
    expect(mockNavigate).toHaveBeenCalledWith({ pathname: '/cart' });
  });

  it.each([
    [false, true, false, 'tab_bar.favorites.  '],
    [true, false, true, 'tab_bar.favorites.  '],
    [true, true, false, 'tab_bar.favorites. common.products: 4. '],
    [false, false, true, 'tab_bar.favorites. common.products: 4. '],
  ])(
    'should label the favorites tab with new services %j, shop badge %j and configured counter %j as %j',
    (newServices, showWishlistItemsCountBadge, showConfiguredCounter, ariaLabel) => {
      hasNewServices.mockReturnValue(newServices);
      getShowWishlistItemsCountBadge.mockReturnValue(showWishlistItemsCountBadge);
      useShowFavoritesCounter.mockReturnValue(showConfiguredCounter);
      getFavoritesCount.mockReturnValue(4);
      useTabBarItems.mockReturnValue([item('favorites')]);

      render(<TabBar {...props} />);

      expect(screen.getByRole('tab')).toHaveAttribute('aria-label', ariaLabel);
    }
  );

  it('should render the favorites badge inside the favorites tab', () => {
    getFavoritesCount.mockReturnValue(5);
    useTabBarItems.mockReturnValue([item('home'), item('favorites')]);

    const { unmount } = render(<TabBar {...props} />);
    const [home, favorites] = screen.getAllByRole('tab');

    expect(within(favorites).getByText('5')).toBeInTheDocument();
    expect(within(home).queryByText('5')).not.toBeInTheDocument();

    unmount();
    getShowWishlistItemsCountBadge.mockReturnValue(false);
    render(<TabBar {...props} />);

    expect(within(screen.getAllByRole('tab')[1]).queryByText('5')).not.toBeInTheDocument();
  });

  it('should pass the props without TabBarAction to the cart before portal of a deleted Cart', () => {
    const before = createPortalSpy();
    const after = createPortalSpy();
    registerPortals({
      [TAB_BAR_CART_BEFORE]: before,
      [TAB_BAR_CART_AFTER]: after,
    });
    useTabBarItems.mockReturnValue([item('home')]);

    render(<TabBar {...props} />);
    const expected = {
      ...TAB_BAR_ACTION_DEFAULTS,
      type: TAB_CART,
      label: 'tab_bar.cart',
      isHighlighted: false,
      path: '/',
      historyPush: expect.any(Function),
      cartProductCount: 0,
    };

    expect(getPortalProps(before)).toEqual(expected);
    expect(getPortalProps(after)).toEqual({
      ...expected,
      TabBarAction: TabBarActionComponent,
    });
  });

  it('should not pass the portal props of the tab types to the tab buttons', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    getCartProductCount.mockReturnValue(1);
    getFavoritesCount.mockReturnValue(1);

    try {
      render(<TabBar {...props} />);
      const attributes = screen.getAllByRole('tab')
        .flatMap(tab => tab.getAttributeNames().map(name => name.toLowerCase()));

      [
        'cartproductcount',
        'favoritescount',
        'showwishlistitemscountbadge',
        'widgetsettings',
        'historypush',
        'path',
        'configuredicon',
        'portalsonly',
        'openscategorydrawer',
      ].forEach((name) => {
        expect(attributes).not.toContain(name);
      });
      expect(consoleError).not.toHaveBeenCalled();
    } finally {
      consoleError.mockRestore();
    }
  });

  it('should not pass an own cartProductCount of a tab from the tabs map to the tab button', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    getCartProductCount.mockReturnValue(2);
    const Cart = tabs[TAB_CART];

    try {
      render(<Cart type={TAB_CART} label="tab_bar.cart" path="/" cartProductCount={7} />);
      const tab = screen.getByRole('tab');

      expect(tab.getAttributeNames().map(name => name.toLowerCase())).not.toContain('cartproductcount');
      expect(tab).toHaveAttribute('aria-label', 'tab_bar.cart. common.products: 2.');
      expect(consoleError).not.toHaveBeenCalled();
    } finally {
      consoleError.mockRestore();
    }
  });
});
/* eslint-enable react/prop-types */
