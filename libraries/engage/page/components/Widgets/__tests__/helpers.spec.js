import { ALLOWED_PAGE_PREVIEW_ORIGINS } from '../constants';
import { isAllowedOrigin } from '../helpers';

describe('engage > page > components > Widgets > helpers', () => {
  describe('isAllowedOrigin()', () => {
    it('should match origins without a wildcard exactly', () => {
      expect(isAllowedOrigin('http://localhost:1337', ALLOWED_PAGE_PREVIEW_ORIGINS)).toBe(true);
      expect(isAllowedOrigin('http://localhost:1338', ALLOWED_PAGE_PREVIEW_ORIGINS)).toBe(false);
      expect(isAllowedOrigin('https://localhost:1337', ALLOWED_PAGE_PREVIEW_ORIGINS)).toBe(false);
    });

    it('should match sub domains at any depth', () => {
      expect(isAllowedOrigin('https://app.shopgate.com', ALLOWED_PAGE_PREVIEW_ORIGINS)).toBe(true);
      expect(isAllowedOrigin('https://admin-mono-us.shopgate.com', ALLOWED_PAGE_PREVIEW_ORIGINS)).toBe(true);
      expect(isAllowedOrigin('https://next.us.admin.shopgate.com', ALLOWED_PAGE_PREVIEW_ORIGINS)).toBe(true);
      expect(isAllowedOrigin('https://app.shopgatedev.com', ALLOWED_PAGE_PREVIEW_ORIGINS)).toBe(true);
      expect(isAllowedOrigin('https://app.shopgatepg.com', ALLOWED_PAGE_PREVIEW_ORIGINS)).toBe(true);
    });

    it('should not match the bare domain of a wildcard pattern', () => {
      expect(isAllowedOrigin('https://shopgate.com', ALLOWED_PAGE_PREVIEW_ORIGINS)).toBe(false);
    });

    it('should not match origins that only contain an allowed domain', () => {
      expect(isAllowedOrigin('https://app.shopgate.com.attacker.example', ALLOWED_PAGE_PREVIEW_ORIGINS)).toBe(false);
      expect(isAllowedOrigin('https://attacker.example/app.shopgate.com', ALLOWED_PAGE_PREVIEW_ORIGINS)).toBe(false);
      expect(isAllowedOrigin('https://shopgateXcom', ['https://*.shopgate.com'])).toBe(false);
      expect(isAllowedOrigin('https://app.myshopgate.com', ALLOWED_PAGE_PREVIEW_ORIGINS)).toBe(false);
    });

    it('should enforce the scheme of a wildcard pattern', () => {
      expect(isAllowedOrigin('http://app.shopgate.com', ALLOWED_PAGE_PREVIEW_ORIGINS)).toBe(false);
    });

    it('should not match a port that was not part of the pattern', () => {
      expect(isAllowedOrigin('https://app.shopgate.com:8443', ALLOWED_PAGE_PREVIEW_ORIGINS)).toBe(false);
    });

    it('should reject values that are no usable origins', () => {
      expect(isAllowedOrigin('null', ALLOWED_PAGE_PREVIEW_ORIGINS)).toBe(false);
      expect(isAllowedOrigin('', ALLOWED_PAGE_PREVIEW_ORIGINS)).toBe(false);
      expect(isAllowedOrigin(undefined, ALLOWED_PAGE_PREVIEW_ORIGINS)).toBe(false);
      expect(isAllowedOrigin(null, ALLOWED_PAGE_PREVIEW_ORIGINS)).toBe(false);
    });

    it('should reject every origin when no patterns are given', () => {
      expect(isAllowedOrigin('https://app.shopgate.com')).toBe(false);
      expect(isAllowedOrigin('https://app.shopgate.com', [])).toBe(false);
    });
  });
});
