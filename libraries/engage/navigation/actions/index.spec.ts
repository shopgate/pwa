import { toPathname } from './index';

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
