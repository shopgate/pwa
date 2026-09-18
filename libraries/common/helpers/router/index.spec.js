import { logger } from '@shopgate/pwa-core/helpers';
import { sanitizeLink } from './index';

jest.mock('@shopgate/pwa-core/helpers', () => ({
  logger: {
    warn: jest.fn(),
  },
}));

describe('Router helpers', () => {
  describe('sanitizeLink()', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return an empty string for invalid input', () => {
      expect(sanitizeLink()).toBe('');
      expect(sanitizeLink('')).toBe('');
      expect(sanitizeLink(null)).toBe('');
      expect(sanitizeLink({})).toBe('');
    });

    it.each([
      '/item/313233',
      'shopgate-10006://category/3132?foo=bar&baz=1',
      'https://example.com/search?s=Tom%20%26%20Jerry&sort=relevance',
      '/search?s=some+search+phrase',
      '/page/imprint#section-2',
      'https://example.com/callback?redirect=https%3A%2F%2Fexample.com%3Fa%3D1%26notify%3D1',
      'http !@@##%$^&^*&* s://example.com/',
    ])('should not modify the safe link %s', (link) => {
      expect(sanitizeLink(link)).toBe(link);
      expect(logger.warn).not.toHaveBeenCalled();
    });

    it.each([
      // eslint-disable-next-line no-script-url
      'javascript:alert(1)',
      ' JavaScript:alert(1)',
      'data:text/html,<script>alert(1)</script>',
      'vbscript:msgbox(1)',
    ])('should reject the link %s', (link) => {
      expect(sanitizeLink(link)).toBe('');
      expect(logger.warn).toHaveBeenCalledTimes(1);
    });

    it('should remove markup from query parameters', () => {
      expect(sanitizeLink('shopgate-10006://search?s=<img src=x onerror=alert(1)>test&sort=relevance'))
        .toBe('shopgate-10006://search?s=test&sort=relevance');
      expect(logger.warn).toHaveBeenCalledTimes(1);
    });

    it('should remove URL encoded markup from query parameters', () => {
      expect(sanitizeLink('/search?s=%3Cimg%20src%3Dx%20onerror%3Dalert(1)%3Etest'))
        .toBe('/search?s=test');
    });

    it('should remove entity encoded angle brackets from query parameters', () => {
      expect(sanitizeLink('/search?s=%26lt%3Bimg%20src%3Dx%26gt%3Btest'))
        .toBe('/search?s=img+src%3Dxtest');
      expect(sanitizeLink('/search?s=%26%2360%3Bb%26%23x3E%3Btest'))
        .toBe('/search?s=btest');
    });

    it('should remove markup from query parameter keys', () => {
      expect(sanitizeLink('/search?%3Csvg%3E=1')).toBe('/search?=1');
    });

    it('should remove markup from path segments', () => {
      expect(sanitizeLink('/category/%3Cimg%20src%3Dx%20onerror%3Dalert(1)%3E/foo'))
        .toBe('/category//foo');
      expect(sanitizeLink('/category/abc%3Csvg%3Edef/foo'))
        .toBe('/category/abcdef/foo');
    });

    it('should remove markup from the hash', () => {
      expect(sanitizeLink('/page/imprint#%3Cimg%20src%3Dx%3Etop')).toBe('/page/imprint#top');
    });
  });
});
