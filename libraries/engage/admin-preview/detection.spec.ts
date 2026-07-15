import {
  SESSION_STORAGE_KEY_FRONTEND_SETTINGS_PREVIEW,
  SESSION_STORAGE_KEY_PAGE_PREVIEW,
  detectAdminPreview,
  detectFrontendSettingsAdminPreview,
  detectPageAdminPreview,
  getAdminPreviewDebugInfo,
} from './detection';

jest.mock('@shopgate/pwa-core/helpers', () => ({
  logger: {
    log: jest.fn(),
    warn: jest.fn(),
  },
}));

/**
 * Replaces window.location, which jsdom does not allow to be mutated directly.
 * @param location Partial location properties to simulate.
 * @param location.pathname The pathname to simulate.
 * @param location.search The query string to simulate.
 */
const mockLocation = (location: { pathname?: string, search?: string }) => {
  const { pathname = '/', search = '' } = location;

  Object.defineProperty(window, 'location', {
    writable: true,
    value: {
      pathname,
      search,
      href: `http://localhost${pathname}${search}`,
    },
  });
};

/**
 * Simulates a browser that denies session storage access, like a sandboxed iframe without
 * "allow-same-origin".
 */
const mockBlockedSessionStorage = () => {
  Object.defineProperty(window, 'sessionStorage', {
    configurable: true,
    get() {
      throw new Error('SecurityError: sessionStorage is not available');
    },
  });
};

describe('admin-preview detection', () => {
  const originalLocation = window.location;
  const originalSessionStorage = Object.getOwnPropertyDescriptor(window, 'sessionStorage');

  beforeEach(() => {
    window.sessionStorage.clear();
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalLocation,
    });

    if (originalSessionStorage) {
      Object.defineProperty(window, 'sessionStorage', originalSessionStorage);
    }
  });

  describe('detectFrontendSettingsAdminPreview', () => {
    it('detects preview mode from the query param', () => {
      mockLocation({ search: '?frontendSettingsPreview=true' });

      expect(detectFrontendSettingsAdminPreview()).toBe(true);
    });

    it('detects preview mode when the param is combined with others', () => {
      mockLocation({ search: '?foo=bar&frontendSettingsPreview=true' });

      expect(detectFrontendSettingsAdminPreview()).toBe(true);
    });

    it('returns false without the query param', () => {
      mockLocation({ search: '' });

      expect(detectFrontendSettingsAdminPreview()).toBe(false);
    });

    it('returns false when the param is set to another value', () => {
      mockLocation({ search: '?frontendSettingsPreview=false' });

      expect(detectFrontendSettingsAdminPreview()).toBe(false);
    });

    it('persists a sticky flag when the param is present', () => {
      mockLocation({ search: '?frontendSettingsPreview=true' });

      detectFrontendSettingsAdminPreview();

      expect(window.sessionStorage.getItem(SESSION_STORAGE_KEY_FRONTEND_SETTINGS_PREVIEW))
        .toBe('1');
    });

    it('stays true after the query param disappeared from the url', () => {
      mockLocation({ search: '?frontendSettingsPreview=true' });
      expect(detectFrontendSettingsAdminPreview()).toBe(true);

      // The url lost the query param, e.g. through a reload or a history rewrite.
      mockLocation({ search: '' });

      expect(detectFrontendSettingsAdminPreview()).toBe(true);
    });
  });

  describe('detectPageAdminPreview', () => {
    it('detects preview mode from the pathname', () => {
      mockLocation({ pathname: '/shopgate-internal-page-preview/123' });

      expect(detectPageAdminPreview()).toBe(true);
    });

    it('returns false for other pathnames', () => {
      mockLocation({ pathname: '/category/1' });

      expect(detectPageAdminPreview()).toBe(false);
    });

    it('stays true after the pathname changed', () => {
      mockLocation({ pathname: '/shopgate-internal-page-preview/123' });
      expect(detectPageAdminPreview()).toBe(true);

      mockLocation({ pathname: '/' });

      expect(detectPageAdminPreview()).toBe(true);
    });

    it('persists a sticky flag when the pathname matches', () => {
      mockLocation({ pathname: '/shopgate-internal-page-preview/123' });

      detectPageAdminPreview();

      expect(window.sessionStorage.getItem(SESSION_STORAGE_KEY_PAGE_PREVIEW)).toBe('1');
    });
  });

  describe('detectAdminPreview', () => {
    it('returns true in page preview mode', () => {
      mockLocation({ pathname: '/shopgate-internal-page-preview/123' });

      expect(detectAdminPreview()).toBe(true);
    });

    it('returns true in frontend settings preview mode', () => {
      mockLocation({ search: '?frontendSettingsPreview=true' });

      expect(detectAdminPreview()).toBe(true);
    });

    it('returns false outside of preview mode', () => {
      mockLocation({
        pathname: '/',
        search: '',
      });

      expect(detectAdminPreview()).toBe(false);
    });
  });

  describe('getAdminPreviewDebugInfo', () => {
    it('reports the detected state', () => {
      mockLocation({ search: '?frontendSettingsPreview=true' });

      const info = getAdminPreviewDebugInfo();

      expect(info.detected).toEqual({
        page: false,
        frontendSettings: true,
        any: true,
      });
      expect(info.search).toBe('?frontendSettingsPreview=true');
    });

    it('reports the sticky flags as they were persisted before the call', () => {
      mockLocation({ search: '?frontendSettingsPreview=true' });

      // Nothing was persisted yet, so the flag is still false while detection reports true.
      expect(getAdminPreviewDebugInfo().stickyFlags.frontendSettings).toBe(false);

      // The call above ran detection, which persisted the flag.
      expect(getAdminPreviewDebugInfo().stickyFlags.frontendSettings).toBe(true);
    });

    it('reports when the url lost the param after boot', () => {
      mockLocation({ search: '?frontendSettingsPreview=true' });
      detectFrontendSettingsAdminPreview();

      mockLocation({ search: '' });
      const info = getAdminPreviewDebugInfo();

      // The sticky flag keeps preview alive even though the url no longer carries the param.
      expect(info.stickyFlags.frontendSettings).toBe(true);
      expect(info.detected.frontendSettings).toBe(true);
      expect(info.search).toBe('');
    });

    it('is exposed on window for inspection on deployed builds', () => {
      expect(typeof Reflect.get(window, 'SGAdminPreviewDebug')).toBe('function');
    });
  });

  describe('when session storage is not accessible', () => {
    it('still detects preview mode from the url without throwing', () => {
      mockLocation({ search: '?frontendSettingsPreview=true' });
      mockBlockedSessionStorage();

      expect(() => detectFrontendSettingsAdminPreview()).not.toThrow();
      expect(detectFrontendSettingsAdminPreview()).toBe(true);
    });

    it('returns false without throwing when the url has no preview marker', () => {
      mockLocation({
        pathname: '/',
        search: '',
      });
      mockBlockedSessionStorage();

      expect(() => detectAdminPreview()).not.toThrow();
      expect(detectAdminPreview()).toBe(false);
    });
  });
});
