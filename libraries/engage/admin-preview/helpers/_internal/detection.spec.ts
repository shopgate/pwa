import type * as Detection from './detection';

/**
 * Replaces window.location, which jsdom does not allow to be mutated directly. Must run before
 * loadDetection(), since the module captures the url when it is evaluated.
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
 * Loads a fresh copy of the detection module. Preview mode is latched in module state, so every
 * test needs its own instance - this also mirrors reality, where each preview iframe evaluates
 * the module in its own document.
 * @returns The freshly evaluated detection module.
 */
const loadDetection = (): typeof Detection => {
  let detection: typeof Detection | undefined;

  jest.isolateModules(() => {
    // eslint-disable-next-line global-require
    detection = require('./detection');
  });

  return detection as typeof Detection;
};

describe('admin-preview detection', () => {
  const originalLocation = window.location;

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalLocation,
    });
  });

  describe('detectFrontendSettingsAdminPreview', () => {
    it('detects preview mode from the query param', () => {
      mockLocation({ search: '?frontendSettingsPreview=true' });

      expect(loadDetection().detectFrontendSettingsAdminPreview()).toBe(true);
    });

    it('detects preview mode when the param is combined with others', () => {
      mockLocation({ search: '?foo=bar&frontendSettingsPreview=true' });

      expect(loadDetection().detectFrontendSettingsAdminPreview()).toBe(true);
    });

    it('returns false without the query param', () => {
      mockLocation({ search: '' });

      expect(loadDetection().detectFrontendSettingsAdminPreview()).toBe(false);
    });

    it('returns false when the param is set to another value', () => {
      mockLocation({ search: '?frontendSettingsPreview=false' });

      expect(loadDetection().detectFrontendSettingsAdminPreview()).toBe(false);
    });

    it('stays true once the app navigated away from the url carrying the param', () => {
      mockLocation({ search: '?frontendSettingsPreview=true' });
      const detection = loadDetection();
      expect(detection.detectFrontendSettingsAdminPreview()).toBe(true);

      // The admin browses the app, so the router pushes a url without the param.
      mockLocation({
        pathname: '/category/123',
        search: '',
      });

      expect(detection.detectFrontendSettingsAdminPreview()).toBe(true);
    });

    it('turns on when the param only appears after the module was evaluated', () => {
      mockLocation({ search: '' });
      const detection = loadDetection();
      expect(detection.detectFrontendSettingsAdminPreview()).toBe(false);

      mockLocation({ search: '?frontendSettingsPreview=true' });

      expect(detection.detectFrontendSettingsAdminPreview()).toBe(true);
    });
  });

  describe('detectPageAdminPreview', () => {
    it('detects preview mode from the pathname', () => {
      mockLocation({ pathname: '/shopgate-internal-page-preview/123' });

      expect(loadDetection().detectPageAdminPreview()).toBe(true);
    });

    it('returns false for other pathnames', () => {
      mockLocation({ pathname: '/category/1' });

      expect(loadDetection().detectPageAdminPreview()).toBe(false);
    });

    it('stays true after the pathname changed', () => {
      mockLocation({ pathname: '/shopgate-internal-page-preview/123' });
      const detection = loadDetection();
      expect(detection.detectPageAdminPreview()).toBe(true);

      mockLocation({ pathname: '/' });

      expect(detection.detectPageAdminPreview()).toBe(true);
    });
  });

  describe('isolation between documents', () => {
    // Regression test: the admin renders the preview in same-origin iframes on several screens
    // within one tab. Detection must never leak from one screen into the next - which is what a
    // sessionStorage-backed flag did, since that storage is shared per tab, not per frame.
    it('does not inherit a latched result from a previously loaded module', () => {
      mockLocation({ pathname: '/shopgate-internal-page-preview/123' });
      expect(loadDetection().detectPageAdminPreview()).toBe(true);

      // A second iframe opens on a url that is not a page preview.
      mockLocation({ search: '?frontendSettingsPreview=true' });
      const secondFrame = loadDetection();

      expect(secondFrame.detectPageAdminPreview()).toBe(false);
      expect(secondFrame.detectFrontendSettingsAdminPreview()).toBe(true);
    });

    it('does not leak a frontend settings result into a page preview document', () => {
      mockLocation({ search: '?frontendSettingsPreview=true' });
      expect(loadDetection().detectFrontendSettingsAdminPreview()).toBe(true);

      mockLocation({ pathname: '/shopgate-internal-page-preview/123' });
      const secondFrame = loadDetection();

      expect(secondFrame.detectFrontendSettingsAdminPreview()).toBe(false);
      expect(secondFrame.detectPageAdminPreview()).toBe(true);
    });
  });

  describe('detectAdminPreview', () => {
    it('returns true in page preview mode', () => {
      mockLocation({ pathname: '/shopgate-internal-page-preview/123' });

      expect(loadDetection().detectAdminPreview()).toBe(true);
    });

    it('returns true in frontend settings preview mode', () => {
      mockLocation({ search: '?frontendSettingsPreview=true' });

      expect(loadDetection().detectAdminPreview()).toBe(true);
    });

    it('returns false outside of preview mode', () => {
      mockLocation({
        pathname: '/',
        search: '',
      });

      expect(loadDetection().detectAdminPreview()).toBe(false);
    });
  });

  describe('getAdminPreviewDebugInfo', () => {
    it('reports the detected state', () => {
      mockLocation({ search: '?frontendSettingsPreview=true' });

      const info = loadDetection().getAdminPreviewDebugInfo();

      expect(info.detected).toEqual({
        page: false,
        frontendSettings: true,
        any: true,
      });
      expect(info.search).toBe('?frontendSettingsPreview=true');
    });

    it('reports the latches as they were before the call', () => {
      mockLocation({ search: '?frontendSettingsPreview=true' });
      const detection = loadDetection();

      // Nothing latched yet, so the flag is still false while detection reports true.
      expect(detection.getAdminPreviewDebugInfo().latched.frontendSettings).toBe(false);

      // The call above ran detection, which latched the result.
      expect(detection.getAdminPreviewDebugInfo().latched.frontendSettings).toBe(true);
    });

    it('reports when the url changed since the module was evaluated', () => {
      mockLocation({ search: '?frontendSettingsPreview=true' });
      const detection = loadDetection();

      expect(detection.getAdminPreviewDebugInfo().urlChangedSinceBoot).toBe(false);

      mockLocation({ pathname: '/category/123' });

      const info = detection.getAdminPreviewDebugInfo();
      expect(info.urlChangedSinceBoot).toBe(true);
      expect(info.initialHref).toBe('http://localhost/?frontendSettingsPreview=true');
      expect(info.currentHref).toBe('http://localhost/category/123');
    });

    it('is exposed on window for inspection on deployed builds', () => {
      mockLocation({ search: '' });
      loadDetection();

      expect(typeof Reflect.get(window, 'SGAdminPreviewDebug')).toBe('function');
    });
  });
});
