/**
 * Internal to the admin-preview package - do not import this module from anywhere else. Consume
 * the isAdminPreviewActive / isPageAdminPreviewActive / isFrontendSettingsAdminPreviewActive
 * helpers from @shopgate/engage/admin-preview/helpers instead.
 */

import { PAGE_PREVIEW_PATTERN } from '../../constants';

export const FRONTEND_SETTINGS_PREVIEW_PARAM = 'frontendSettingsPreview=true';

/**
 * The url as it was when this module was first evaluated. Captured here because detection can run
 * again later, when the url may already have been rewritten.
 */
const INITIAL_HREF = window.location.href;

/**
 * Preview mode is latched in memory rather than persisted. Session storage is scoped per origin
 * per tab, not per iframe - the admin shows the preview in same-origin iframes on several screens
 * within one tab, so a persisted flag from one screen would leak into the next. Module state is
 * per document, so each iframe gets its own.
 *
 * The latches only ever go false -> true. Detection must not fall back to re-reading the url,
 * because the frontend settings preview navigates the app normally: once the admin opens another
 * page, the query param is gone from the url even though preview mode is still on.
 */
let pageAdminPreviewLatched = false;

let frontendSettingsAdminPreviewLatched = false;

/**
 * Detects whether the app is in page admin preview mode. Once detected, the result is latched for
 * the lifetime of the document, because the url is not guaranteed to keep the preview marker.
 * @returns True if the app is in page admin preview mode, false otherwise.
 */
export const detectPageAdminPreview = (): boolean => {
  if (pageAdminPreviewLatched) {
    return true;
  }

  pageAdminPreviewLatched = window.location.pathname.startsWith(PAGE_PREVIEW_PATTERN);

  return pageAdminPreviewLatched;
};

/**
 * Detects whether the app is in frontend settings admin preview mode. Once detected, the result is
 * latched for the lifetime of the document, because the app keeps navigating while the preview is
 * open and the query param only exists on the url it started on.
 * @returns True if the app is in frontend settings admin preview mode, false otherwise.
 */
export const detectFrontendSettingsAdminPreview = (): boolean => {
  if (frontendSettingsAdminPreviewLatched) {
    return true;
  }

  frontendSettingsAdminPreviewLatched = window
    .location
    .search
    .includes(FRONTEND_SETTINGS_PREVIEW_PARAM);

  return frontendSettingsAdminPreviewLatched;
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
 * Compare initialHref with currentHref to see whether the url changed since the app booted, and
 * check latched to see whether a result came from the latch rather than the current url.
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
  latched: {
    page: pageAdminPreviewLatched,
    frontendSettings: frontendSettingsAdminPreviewLatched,
  },
  detected: {
    page: detectPageAdminPreview(),
    frontendSettings: detectFrontendSettingsAdminPreview(),
    any: detectAdminPreview(),
  },
});

// @ts-expect-error - debug-only global, intentionally not on the Window type.
window.SGAdminPreviewDebug = getAdminPreviewDebugInfo;
