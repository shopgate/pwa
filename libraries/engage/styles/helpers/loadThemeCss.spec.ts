import { withScope, captureMessage } from '@sentry/browser';
import { appConfig } from '@shopgate/engage';
// Imported on purpose rather than simulated: the ordering of these two against each other is the
// contract, so the test should exercise the real preview insertion.
import {
  PREVIEW_STYLE_TAG_ID,
  getOrCreateStyleTag,
} from '@shopgate/engage/admin-preview/components/FrontendSettingsPreviewBridge/helpers';
import { loadThemeCss } from './loadThemeCss';

jest.mock('@shopgate/engage', () => ({
  __esModule: true,
  appConfig: {},
}));

jest.mock('@sentry/browser', () => ({
  withScope: jest.fn(),
  captureMessage: jest.fn(),
  Severity: {
    Error: 'error',
    Warning: 'warning',
  },
}));

const REQUEST_TIMEOUT = 3000;
const LINK_TAG_ID = 'theme-css';

// The mocked config is read inside loadThemeCss, so tests can just mutate it.
const config = appConfig as { themeCssUrl?: string | null };

/**
 * Returns the injected link tag.
 * @returns The link tag, or null when none was injected.
 */
const getLinkTag = () => document.querySelector<HTMLLinkElement>(`#${LINK_TAG_ID}`);

/**
 * Returns the injected link tag, throwing when it is absent - that is the failure the tests
 * guard against, and it gives a clearer message than a null dereference.
 * @returns The injected link tag.
 */
const requireLinkTag = () => {
  const linkTag = getLinkTag();

  if (!linkTag) {
    throw new Error(`No link with id "${LINK_TAG_ID}" was injected`);
  }

  return linkTag;
};

describe('styles / helpers / loadThemeCss', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    document.head.innerHTML = '';
    delete config.themeCssUrl;

    // withScope is only used to configure the Sentry scope, so a stub scope is enough to let
    // the callback run and reach captureMessage.
    (withScope as jest.Mock).mockImplementation((callback: (scope: unknown) => void) => {
      callback({
        setLevel: jest.fn(),
        setExtra: jest.fn(),
      });
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('without a configured url', () => {
    it('resolves without injecting a link', async () => {
      await expect(loadThemeCss()).resolves.toBeUndefined();

      expect(getLinkTag()).toBeNull();
    });

    it('resolves when the url is null', async () => {
      config.themeCssUrl = null;

      await expect(loadThemeCss()).resolves.toBeUndefined();

      expect(getLinkTag()).toBeNull();
    });
  });

  describe('with a configured url', () => {
    beforeEach(() => {
      config.themeCssUrl = 'https://example.com/theme.css';
    });

    it('injects a stylesheet link and resolves once it loaded', async () => {
      const promise = loadThemeCss();
      const linkTag = requireLinkTag();

      expect(linkTag.rel).toBe('stylesheet');
      expect(linkTag.href).toBe('https://example.com/theme.css');

      linkTag.onload?.(new Event('load'));

      await expect(promise).resolves.toBeUndefined();
      expect(captureMessage).not.toHaveBeenCalled();
    });

    it('inserts the link at the theme css insertion point', () => {
      document.head.innerHTML = `
        <meta name="emotion-insertion-point" content="" />
        <style data-emotion="sg"></style>
        <meta name="theme-css-insertion-point" content="" />
      `;

      loadThemeCss();

      const insertionPoint = document.querySelector('meta[name="theme-css-insertion-point"]');

      expect(insertionPoint?.nextElementSibling).toBe(requireLinkTag());
    });

    it('keeps the link below the tss styles and above the preview css', () => {
      document.head.innerHTML = `
        <meta name="emotion-insertion-point" content="" />
        <style id="tss" data-emotion="sg"></style>
        <meta name="theme-css-insertion-point" content="" />
        <meta name="preview-css-insertion-point" content="" />
      `;

      loadThemeCss();

      // The admin preview pins its style tag to the anchor below, once it received the styling
      // from the parent window.
      getOrCreateStyleTag();

      const ids = Array.from(document.head.children).map(child => child.id).filter(Boolean);

      expect(ids).toEqual(['tss', LINK_TAG_ID, PREVIEW_STYLE_TAG_ID]);
    });

    it('appends the link when the insertion point is missing', () => {
      loadThemeCss();

      expect(document.head.lastChild).toBe(requireLinkTag());
    });

    it('resolves and reports to Sentry when the file does not exist', async () => {
      const promise = loadThemeCss();

      requireLinkTag().onerror?.(new Event('error'));

      await expect(promise).resolves.toBeUndefined();
      expect(captureMessage).toHaveBeenCalledWith('Fetching theme css failed');
    });

    it('resolves and reports to Sentry when the file takes too long', async () => {
      const promise = loadThemeCss();

      jest.advanceTimersByTime(REQUEST_TIMEOUT);

      await expect(promise).resolves.toBeUndefined();
      expect(captureMessage).toHaveBeenCalledWith('Fetching theme css took too long');
    });

    it('keeps the link after the timeout, so late styles still apply', async () => {
      const promise = loadThemeCss();

      jest.advanceTimersByTime(REQUEST_TIMEOUT);
      await promise;

      expect(getLinkTag()).not.toBeNull();
    });

    it('does not report a timeout after the file loaded', async () => {
      const promise = loadThemeCss();

      requireLinkTag().onload?.(new Event('load'));
      await promise;

      jest.advanceTimersByTime(REQUEST_TIMEOUT);

      expect(captureMessage).not.toHaveBeenCalled();
    });

    it('resolves immediately when an already loaded link is present', async () => {
      const linkTag = document.createElement('link');
      linkTag.id = LINK_TAG_ID;
      Object.defineProperty(linkTag, 'sheet', { value: {} });
      document.head.appendChild(linkTag);

      await expect(loadThemeCss()).resolves.toBeUndefined();

      expect(document.querySelectorAll(`#${LINK_TAG_ID}`)).toHaveLength(1);
    });

    it('waits for an existing link that is still loading', async () => {
      const linkTag = document.createElement('link');
      linkTag.id = LINK_TAG_ID;
      document.head.appendChild(linkTag);

      const promise = loadThemeCss();
      linkTag.dispatchEvent(new Event('load'));

      await expect(promise).resolves.toBeUndefined();
      expect(document.querySelectorAll(`#${LINK_TAG_ID}`)).toHaveLength(1);
    });
  });
});
