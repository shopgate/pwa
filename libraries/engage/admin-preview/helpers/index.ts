import {
  detectAdminPreview,
  detectFrontendSettingsAdminPreview,
  detectPageAdminPreview,
} from './_internal/detection';
import { matchesAllowedOrigin, readReferrerOrigin } from './_internal/origins';

/**
 * Checks if the app is currently in admin preview mode (pages or frontend settings).
 * @returns True if the app is in admin preview mode, false otherwise.
 */
export const isAdminPreviewActive = (): boolean =>
  detectAdminPreview();

/**
 * Checks if the app is currently in page admin preview mode.
 * @returns True if the app is in page admin preview mode, false otherwise.
 */
export const isPageAdminPreviewActive = (): boolean =>
  detectPageAdminPreview();

/**
 * Checks if the app is currently in frontend settings admin preview mode.
 * @returns True if the app is in frontend settings admin preview mode, false otherwise.
 */
export const isFrontendSettingsAdminPreviewActive = (): boolean =>
  detectFrontendSettingsAdminPreview();

/**
 * Checks if navigation is blocked. Page admin preview renders a single page in an iframe, so
 * leaving that page would only ever show the admin something it did not ask to preview.
 * Frontend settings preview is not affected - it previews styling on the regular app.
 * @returns True if the app must not navigate, false otherwise.
 */
export const isNavigationBlocked = (): boolean =>
  isPageAdminPreviewActive();

/**
 * Checks if an origin is covered by a list of allowed origin patterns. See
 * ALLOWED_ADMIN_PREVIEW_ORIGINS for details about the supported wildcard syntax.
 * @param origin The origin to check e.g. "https://app.shopgate.com".
 * @param patterns The allowed origin patterns.
 * @returns Whether the origin is allowed.
 */
export const isAllowedOrigin = (
  origin: string | null | undefined,
  patterns: string[] = []
): origin is string => matchesAllowedOrigin(origin, patterns);

/**
 * Determines the origin of the document that embeds the current page.
 * @returns The referrer origin, or null when it can't be determined.
 */
export const getReferrerOrigin = (): string | null => readReferrerOrigin();
