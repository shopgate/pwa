import { toPathname } from './index';

jest.mock('@shopgate/pwa-common/helpers/config', () => ({}));
jest.mock('@shopgate/pwa-common/helpers/data', () => ({ hex2bin: jest.fn() }));
jest.mock('@shopgate/pwa-common/selectors/client', () => ({ hasScannerSupport: jest.fn() }));
jest.mock('@shopgate/pwa-common-commerce/scanner/helpers', () => ({ getScannerRoute: jest.fn() }));
jest.mock('@shopgate/pwa-common-commerce/cart/selectors', () => ({
  getCartProductDisplayCount: jest.fn(),
}));
jest.mock('@shopgate/engage/favorites', () => ({ getFavoritesCount: jest.fn() }));
jest.mock('@shopgate/engage/locations/constants/routes', () => ({
  STORE_FINDER_PATTERN: '/storefinder',
}));
jest.mock('@shopgate/engage/core/hooks', () => ({
  useRoute: jest.fn(),
  useNavigation: jest.fn(),
}));
jest.mock('@shopgate/engage/core/events', () => ({ UIEvents: { emit: jest.fn() } }));
jest.mock('@shopgate/engage/product/hooks/useProductShare', () => jest.fn());

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
