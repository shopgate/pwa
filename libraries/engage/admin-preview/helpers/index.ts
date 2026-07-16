import {
  detectAdminPreview,
  detectFrontendSettingsAdminPreview,
  detectPageAdminPreview,
} from './_internal/detection';

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
