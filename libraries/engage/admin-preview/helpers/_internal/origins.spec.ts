import { ALLOWED_ADMIN_PREVIEW_ORIGINS } from '../../constants';
import { matchesAllowedOrigin } from './origins';

describe('engage > admin-preview > helpers > origins', () => {
  describe('matchesAllowedOrigin()', () => {
    it('should match origins without a wildcard exactly', () => {
      expect(matchesAllowedOrigin('http://localhost:1337', ALLOWED_ADMIN_PREVIEW_ORIGINS)).toBe(true);
      expect(matchesAllowedOrigin('http://localhost:1338', ALLOWED_ADMIN_PREVIEW_ORIGINS)).toBe(false);
      expect(matchesAllowedOrigin('https://localhost:1337', ALLOWED_ADMIN_PREVIEW_ORIGINS)).toBe(false);
    });

    it('should match sub domains at any depth', () => {
      expect(matchesAllowedOrigin('https://app.shopgate.com', ALLOWED_ADMIN_PREVIEW_ORIGINS)).toBe(true);
      expect(matchesAllowedOrigin('https://admin-mono-us.shopgate.com', ALLOWED_ADMIN_PREVIEW_ORIGINS)).toBe(true);
      expect(matchesAllowedOrigin('https://next.us.admin.shopgate.com', ALLOWED_ADMIN_PREVIEW_ORIGINS)).toBe(true);
      expect(matchesAllowedOrigin('https://app.shopgatedev.com', ALLOWED_ADMIN_PREVIEW_ORIGINS)).toBe(true);
      expect(matchesAllowedOrigin('https://app.shopgatepg.com', ALLOWED_ADMIN_PREVIEW_ORIGINS)).toBe(true);
    });

    it('should not match the bare domain of a wildcard pattern', () => {
      expect(matchesAllowedOrigin('https://shopgate.com', ALLOWED_ADMIN_PREVIEW_ORIGINS)).toBe(false);
    });

    it('should not match origins that only contain an allowed domain', () => {
      expect(matchesAllowedOrigin('https://app.shopgate.com.attacker.example', ALLOWED_ADMIN_PREVIEW_ORIGINS)).toBe(false);
      expect(matchesAllowedOrigin('https://attacker.example/app.shopgate.com', ALLOWED_ADMIN_PREVIEW_ORIGINS)).toBe(false);
      expect(matchesAllowedOrigin('https://shopgateXcom', ['https://*.shopgate.com'])).toBe(false);
      expect(matchesAllowedOrigin('https://app.myshopgate.com', ALLOWED_ADMIN_PREVIEW_ORIGINS)).toBe(false);
    });

    it('should enforce the scheme of a wildcard pattern', () => {
      expect(matchesAllowedOrigin('http://app.shopgate.com', ALLOWED_ADMIN_PREVIEW_ORIGINS)).toBe(false);
    });

    it('should not match a port that was not part of the pattern', () => {
      expect(matchesAllowedOrigin('https://app.shopgate.com:8443', ALLOWED_ADMIN_PREVIEW_ORIGINS)).toBe(false);
    });

    it('should reject values that are no usable origins', () => {
      expect(matchesAllowedOrigin('null', ALLOWED_ADMIN_PREVIEW_ORIGINS)).toBe(false);
      expect(matchesAllowedOrigin('', ALLOWED_ADMIN_PREVIEW_ORIGINS)).toBe(false);
      expect(matchesAllowedOrigin(undefined, ALLOWED_ADMIN_PREVIEW_ORIGINS)).toBe(false);
      expect(matchesAllowedOrigin(null, ALLOWED_ADMIN_PREVIEW_ORIGINS)).toBe(false);
    });

    it('should reject every origin when no patterns are given', () => {
      expect(matchesAllowedOrigin('https://app.shopgate.com')).toBe(false);
      expect(matchesAllowedOrigin('https://app.shopgate.com', [])).toBe(false);
    });
  });
});
