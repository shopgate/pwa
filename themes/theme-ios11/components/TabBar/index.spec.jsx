/* eslint-disable react/prop-types */
import {
  render, screen, act,
} from '@testing-library/react';
import { setCSSCustomProp } from '@shopgate/engage/styles/helpers';
import { useElementSize } from '@shopgate/engage/core/hooks';
import {
  TAB_HOME,
  TAB_BROWSE,
  TAB_CART,
  TAB_MORE,
  TAB_FAVORITES,
} from './constants';
import { useTabBarSettings, useTabBarScrollObserver } from './hooks';
import TabBar from './index';

let mockKeyboardOpen = false;

jest.mock('@shopgate/engage/components', () => ({
  KeyboardConsumer: ({ children }) => children({ open: mockKeyboardOpen }),
  SurroundPortals: ({ children }) => children,
}));
jest.mock('@shopgate/engage/core/hooks', () => ({
  useElementSize: jest.fn(),
}));
jest.mock('@shopgate/engage/core/helpers', () => ({
  isAndroidOs: false,
}));
jest.mock('@shopgate/engage/styles/helpers', () => ({
  setCSSCustomProp: jest.fn(),
}));
jest.mock('./connector', () => Component => Component);
jest.mock('./hooks', () => ({
  useTabBarSettings: jest.fn(),
  useTabBarScrollObserver: jest.fn(),
}));
jest.mock('./tabs', () => [
  {
    type: 'home',
    label: 'tab_bar.home',
  },
  {
    type: 'browse',
    label: 'tab_bar.browse',
  },
  {
    type: 'cart',
    label: 'tab_bar.cart',
  },
  {
    type: 'favorites',
    label: 'tab_bar.favorites',
  },
  {
    type: 'more',
    label: 'tab_bar.more',
  },
]);
jest.mock('./helpers/getTabActionComponentForType', () => {
  const Action = ({ label, isHighlighted, path }) => (
    <button type="button" role="tab" aria-selected={isHighlighted} data-path={path}>
      {label}
    </button>
  );

  return {
    __esModule: true,
    default: () => Action,
    tabs: {},
  };
});

const allTabs = [TAB_HOME, TAB_BROWSE, TAB_CART, TAB_FAVORITES, TAB_MORE];

const props = {
  path: '/',
  modalCount: 0,
};

describe('<TabBar />', () => {
  /**
   * @returns {HTMLElement} The tab list, no matter if it's hidden.
   */
  const getTabList = () => screen.getByRole('tablist', { hidden: true });

  beforeEach(() => {
    jest.clearAllMocks();
    mockKeyboardOpen = false;
    useTabBarSettings.mockReturnValue({});
    useElementSize.mockReturnValue({ height: 49 });
  });

  it('should render when visible', () => {
    render(<TabBar {...props} />);

    expect(screen.getByRole('tablist')).toBeVisible();
    expect(screen.getAllByRole('tab').map(tab => tab.textContent))
      .toEqual(allTabs.map(type => `tab_bar.${type}`));
    expect(useTabBarScrollObserver).toHaveBeenCalledWith(true);
    expect(setCSSCustomProp).toHaveBeenLastCalledWith('--tabbar-height', '49px');
  });

  it('should not be visible when invisible', () => {
    render(<TabBar {...props} isVisible={false} />);

    expect(getTabList()).not.toBeVisible();
    expect(useTabBarScrollObserver).toHaveBeenCalledWith(false);
    expect(setCSSCustomProp).toHaveBeenLastCalledWith('--tabbar-height', '0px');
  });

  it('should not render while the keyboard is open', () => {
    mockKeyboardOpen = true;

    const { container } = render(<TabBar {...props} />);

    expect(container).toBeEmptyDOMElement();
  });

  it.each([TAB_HOME, TAB_BROWSE, TAB_CART, TAB_MORE, TAB_FAVORITES])('should highlight the active tab "%s"', (activeTab) => {
    render(<TabBar {...props} activeTab={activeTab} />);

    expect(screen.getAllByRole('tab', { selected: true })).toHaveLength(1);
    expect(screen.getByRole('tab', { selected: true })).toHaveTextContent(`tab_bar.${activeTab}`);
  });

  it('should not highlight a tab without an active tab', () => {
    render(<TabBar {...props} />);

    expect(screen.queryByRole('tab', { selected: true })).not.toBeInTheDocument();
  });

  it('should pass the current path to the tab actions', () => {
    render(<TabBar {...props} path="/cart" />);

    screen.getAllByRole('tab').forEach((tab) => {
      expect(tab).toHaveAttribute('data-path', '/cart');
    });
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

    expect(container.firstChild).toHaveClass('variant-fixed', 'variant-docked');
    expect(container.firstChild).not.toHaveClass('variant-floating');

    useTabBarSettings.mockReturnValue({ variant: 'floating' });
    rerender(<TabBar {...props} path="/other" />);

    expect(container.firstChild).toHaveClass('variant-floating');
    expect(container.firstChild).not.toHaveClass('variant-fixed', 'variant-docked');
  });
});
/* eslint-enable react/prop-types */
