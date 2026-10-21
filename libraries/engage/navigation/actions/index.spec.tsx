import { render, fireEvent, screen } from '@testing-library/react';
import { UIEvents } from '@shopgate/engage/core/events';
import { useNavigation, useRoute } from '@shopgate/engage/core/hooks';
import { toPathname, CORE_NAVIGATION_ACTIONS } from './index';

jest.mock('@shopgate/engage', () => ({ appConfig: {} }));
jest.mock('@shopgate/engage/core/helpers', () => ({ hex2bin: jest.fn() }));
jest.mock('@shopgate/engage/core/selectors', () => ({ hasScannerSupport: jest.fn() }));
jest.mock('@shopgate/engage/scanner/constants', () => ({
  SCANNER_SCOPE_DEFAULT: 'default',
  SCANNER_TYPE_BARCODE: 'barcode',
}));
jest.mock('@shopgate/engage/scanner/helpers', () => ({ getScannerRoute: jest.fn() }));
jest.mock('@shopgate/engage/cart', () => ({
  CART_PATH: '/cart',
  getCartProductDisplayCount: jest.fn(),
}));
jest.mock('@shopgate/engage/favorites', () => ({
  FAVORITES_PATH: '/favourite_list',
  getFavoritesCount: jest.fn(),
}));
jest.mock('@shopgate/engage/product/constants', () => ({ ITEM_PATTERN: '/item/:productId' }));
jest.mock('@shopgate/engage/locations/constants', () => ({
  STORE_FINDER_PATTERN: '/storefinder',
}));
jest.mock('@shopgate/engage/core/hooks', () => ({
  useRoute: jest.fn(),
  useNavigation: jest.fn(),
}));
jest.mock('@shopgate/engage/core/events', () => ({ UIEvents: { emit: jest.fn() } }));
jest.mock('@shopgate/engage/product/hooks', () => ({ useProductShare: jest.fn() }));

describe('toPathname', () => {
  it.each([
    ['/cart', '/cart'],
    ['cart', '/cart'],
    ['  /cart  ', '/cart'],
    ['/cart#foo', '/cart'],
    ['/search?s=a#b', '/search?s=a'],
    ['https://example.org/a#b', 'https://example.org/a#b'],
    ['//example.org', 'https://example.org'],
    ['\\\\example.org', 'https://example.org'],
    ['', ''],
    ['   ', ''],
  ])('turns %j into %j', (link, expected) => {
    expect(toPathname(link)).toBe(expected);
  });

  it.each([42, {}, true, null, undefined])('ignores %j', (link) => {
    expect(toPathname(link)).toBe('');
  });
});

describe('category actions', () => {
  const push = jest.fn();

  /**
   * Renders the button of a core action.
   * @param props The component props.
   * @param props.name The name of the action.
   * @returns The button.
   */
  const ActionButton = ({ name }: { name: string }) => {
    const useAction = CORE_NAVIGATION_ACTIONS[name];
    const action = useAction?.({
      action: name,
      icon: '',
      link: '',
    });
    return <button type="button" onClick={action?.onClick}>{action?.label}</button>;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigation as jest.Mock).mockReturnValue({ push });
    (useRoute as jest.Mock).mockReturnValue({ pathname: '/' });
  });

  it('opens the browse page', () => {
    render(<ActionButton name="browse" />);
    fireEvent.click(screen.getByRole('button', { name: 'tab_bar.browse' }));

    expect(push).toHaveBeenCalledWith({ pathname: '/browse' });
    expect(UIEvents.emit).not.toHaveBeenCalled();
  });

  it('opens the more page', () => {
    render(<ActionButton name="more" />);
    fireEvent.click(screen.getByRole('button', { name: 'tab_bar.more' }));

    expect(push).toHaveBeenCalledWith({ pathname: '/more' });
  });

  it('opens the category drawer', () => {
    render(<ActionButton name="categoryDrawer" />);
    fireEvent.click(screen.getByRole('button', { name: 'navigation.categories' }));

    expect(UIEvents.emit).toHaveBeenCalledWith('navigation.openCategoryDrawer');
    expect(push).not.toHaveBeenCalled();
  });
});
