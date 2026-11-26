import { FAVORITES_PATH } from '@shopgate/pwa-common-commerce/favorites/constants';
import getTabForPathname from './getTabForPathname';

describe('getTabForPathname()', () => {
  it.each([
    ['/', 'home'],
    ['/browse', 'browse'],
    ['/cart', 'cart'],
    [FAVORITES_PATH, 'favorites'],
    ['/more', 'more'],
  ])('assigns %s to its own tab', (pathname, tab) => {
    expect(getTabForPathname(pathname)).toBe(tab);
  });

  it.each([
    '/search',
    '/category',
    '/category/abc',
    '/item/abc',
    '/item/abc/reviews',
  ])('assigns %s to the browse tab', (pathname) => {
    expect(getTabForPathname(pathname)).toBe('browse');
  });

  it.each([undefined, '', '/login', '/page/imprint', '/item', '/cart/coupon'])('assigns %j to no tab', (pathname) => {
    expect(getTabForPathname(pathname)).toBe('none');
  });
});
