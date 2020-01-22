import { openPageExtern, openPage } from '@shopgate/pwa-core';
import { isShopLink, sanitizeLink, openExternalLink } from './handleLinks';

jest.mock('@shopgate/pwa-core', () => ({
  openPageExtern: jest.fn(),
  openPage: jest.fn(),
}));

jest.mock('@shopgate/pwa-common/helpers/config', () => ({
  shopCNAME: 'm.example.com',
}));

describe('handleLinks helpers', () => {
  describe('isShopLink()', () => {
    const positives = [
      'http://foo.shopgate.com',
      'https://foo.shopgate.com',
      'http://foo.shopgate.com/page/cms',
      'https://foo.shopgate.com/page/cms',
      'https://m.example.com',
      'http://m.example.com',
      'http://m.example.com/page/cms',
      'https://m.example.com/page/cms',
      'https://M.ExamPle.com/page/CMS',
    ];

    const negatives = [
      'https://example.com/bar',
      'https://example.com',
      'http://shopgate.com/foo',
      'https://shopgate.com/foo',
      'https://www.shopgate.com',
      'http://www.shopgate.com',
      'http://example.com',
      'https://example.com',
      'https://example.com/page/cms',
      '?foo=bar',
    ];

    positives.forEach((href) => {
      it(`should return true for ${href} link`, () => {
        expect(isShopLink(href)).toBe(true);
      });
    });

    negatives.forEach((href) => {
      it(`should return false for ${href} link`, () => {
        expect(isShopLink(href)).toBe(false);
      });
    });
  });

  describe('sanitizeLink()', () => {
    const links = [
      ['http://m.example.com/', 'http://m.example.com'],
      ['/page/title/', '/page/title'],
      ['/page/title', '/page/title'],
      ['tel:1234/', 'tel:1234'],
      ['tel:1234', 'tel:1234'],
      ['mailto:noreply@shopgate.com', 'mailto:noreply@shopgate.com'],
      ['/cart/?coupon=test', '/cart?coupon=test'],
    ];

    it.each(links)(
      'should sanitize %s to %s',
      (input, output) => {
        expect(sanitizeLink(input)).toBe(output);
      }
    );
  });

  describe('openExternalLink', () => {
    it('should call openPageExtern', () => {
      const location = 'http://m.me/shopgate';
      openExternalLink(
        location,
        'ACTION',
        {},
        { target: '_blank' }
      );
      expect(openPageExtern).toBeCalledTimes(1);
      expect(openPageExtern).toBeCalledWith({ src: location });
      expect(openPage).not.toBeCalled();
    });
  });
});

