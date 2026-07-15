// The logger is imported from @shopgate/pwa-core/helpers rather than @shopgate/engage/core/helpers
// on purpose: that barrel pulls in scrollContainer, which imports this module back. Since detection
// runs while the constants module is evaluated, the cycle would resolve to undefined at boot.
import { logger } from '@shopgate/pwa-core/helpers';

export const PAGE_PREVIEW_PATTERN = '/shopgate-internal-page-preview';

export const FRONTEND_SETTINGS_PREVIEW_PARAM = 'frontendSettingsPreview=true';

export const SESSION_STORAGE_KEY_PAGE_PREVIEW = 'sgPageAdminPreview';

export const SESSION_STORAGE_KEY_FRONTEND_SETTINGS_PREVIEW = 'sgFrontendSettingsAdminPreview';

const LOG_PREFIX = '[AdminPreview]';

/**
 * The url as it was when this module was first evaluated. Captured here because detection can run
 * again later, when the url may already have been rewritten.
 */
const INITIAL_HREF = window.location.href;

/**
 * Remembers the last logged result per detector, so repeated calls only log on a real change.
 * isAdminPreviewActive() is called from hot paths like breakpoints and scroll handling.
 */
const lastLoggedResults: Record<string, boolean> = {};

/**
 * Reads a sticky preview flag. Storage access throws in a sandboxed iframe without
 * "allow-same-origin", and is blocked by some browsers in cross-origin iframes - the preview
 * runs in exactly that context, so a throw here would break app boot for everyone.
 * @param key The session storage key to read.
 * @returns True when the flag was persisted before, false otherwise.
 */
const readStickyFlag = (key: string): boolean => {
  try {
    return window.sessionStorage.getItem(key) === '1';
  } catch (error) {
    logger.warn(`${LOG_PREFIX} session storage is not readable`, {
      key,
      error,
    });
    return false;
  }
};

/**
 * Persists a sticky preview flag, so preview mode survives a reload or a url rewrite that drops
 * the query string. See readStickyFlag for why this can throw.
 * @param key The session storage key to write.
 */
const writeStickyFlag = (key: string): void => {
  try {
    window.sessionStorage.setItem(key, '1');
  } catch (error) {
    logger.warn(`${LOG_PREFIX} session storage is not writable`, {
      key,
      error,
    });
  }
};

/**
 * Logs how a detection result was reached, but only when it differs from the previous result for
 * that detector. Kept verbose on purpose: it exists to investigate why preview mode is not picked
 * up on deployed builds.
 * @param name The detector that produced the result.
 * @param result The detected result.
 * @param matchedUrl Whether the current url carries the preview marker.
 * @param matchedStickyFlag Whether the persisted sticky flag was set.
 */
const logDetection = (
  name: string,
  result: boolean,
  matchedUrl: boolean,
  matchedStickyFlag: boolean
): void => {
  if (lastLoggedResults[name] === result) {
    return;
  }

  lastLoggedResults[name] = result;

  logger.log(`${LOG_PREFIX} ${name} -> ${result}`, {
    result,
    // True when the url still carries the marker.
    matchedUrl,
    // True when the result came from the persisted flag - i.e. the url lost the marker.
    matchedStickyFlag,
    // Compare these two to see whether the url changed since the app booted.
    initialHref: INITIAL_HREF,
    currentHref: window.location.href,
    pathname: window.location.pathname,
    search: window.location.search,
    // A cross-origin parent means the app really is embedded in the admin.
    isInIframe: window.parent !== window,
    referrer: document.referrer,
  });
};

/**
 * Detects whether the app is in page admin preview mode. Once detected, the result is remembered
 * for the rest of the session, because the url is not guaranteed to keep the preview marker.
 * @returns True if the app is in page admin preview mode, false otherwise.
 */
export const detectPageAdminPreview = (): boolean => {
  const matchedUrl = window.location.pathname.startsWith(PAGE_PREVIEW_PATTERN);

  if (matchedUrl) {
    writeStickyFlag(SESSION_STORAGE_KEY_PAGE_PREVIEW);
    logDetection('detectPageAdminPreview', true, true, false);
    return true;
  }

  const matchedStickyFlag = readStickyFlag(SESSION_STORAGE_KEY_PAGE_PREVIEW);
  logDetection('detectPageAdminPreview', matchedStickyFlag, false, matchedStickyFlag);
  return matchedStickyFlag;
};

/**
 * Detects whether the app is in frontend settings admin preview mode. Once detected, the result is
 * remembered for the rest of the session, because the url is not guaranteed to keep the query
 * param.
 * @returns True if the app is in frontend settings admin preview mode, false otherwise.
 */
export const detectFrontendSettingsAdminPreview = (): boolean => {
  const matchedUrl = window.location.search.includes(FRONTEND_SETTINGS_PREVIEW_PARAM);

  if (matchedUrl) {
    writeStickyFlag(SESSION_STORAGE_KEY_FRONTEND_SETTINGS_PREVIEW);
    logDetection('detectFrontendSettingsAdminPreview', true, true, false);
    return true;
  }

  const matchedStickyFlag = readStickyFlag(SESSION_STORAGE_KEY_FRONTEND_SETTINGS_PREVIEW);
  logDetection('detectFrontendSettingsAdminPreview', matchedStickyFlag, false, matchedStickyFlag);
  return matchedStickyFlag;
};

/**
 * Detects whether the app is in admin preview mode (pages or frontend settings).
 * @returns True if the app is in admin preview mode, false otherwise.
 */
export const detectAdminPreview = (): boolean =>
  detectPageAdminPreview() || detectFrontendSettingsAdminPreview();

/**
 * Returns the current detection state. Exposed on window as SGAdminPreviewDebug so the values can
 * be inspected on a deployed build, from the console of the preview iframe:
 *
 *   window.SGAdminPreviewDebug()
 *
 * @returns A snapshot of everything detection depends on.
 */
export const getAdminPreviewDebugInfo = () => ({
  initialHref: INITIAL_HREF,
  currentHref: window.location.href,
  pathname: window.location.pathname,
  search: window.location.search,
  urlChangedSinceBoot: INITIAL_HREF !== window.location.href,
  isInIframe: window.parent !== window,
  referrer: document.referrer,
  stickyFlags: {
    page: readStickyFlag(SESSION_STORAGE_KEY_PAGE_PREVIEW),
    frontendSettings: readStickyFlag(SESSION_STORAGE_KEY_FRONTEND_SETTINGS_PREVIEW),
  },
  detected: {
    page: detectPageAdminPreview(),
    frontendSettings: detectFrontendSettingsAdminPreview(),
    any: detectAdminPreview(),
  },
});

logger.log(`${LOG_PREFIX} module evaluated`, {
  href: INITIAL_HREF,
  search: window.location.search,
  hasParamAtBoot: window.location.search.includes(FRONTEND_SETTINGS_PREVIEW_PARAM),
  isInIframe: window.parent !== window,
  referrer: document.referrer,
});

// @ts-expect-error - debug-only global, intentionally not on the Window type.
window.SGAdminPreviewDebug = getAdminPreviewDebugInfo;
