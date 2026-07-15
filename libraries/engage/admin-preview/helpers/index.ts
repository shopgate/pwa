import {
  detectAdminPreview,
  detectFrontendSettingsAdminPreview,
  detectPageAdminPreview,
} from '../detection';

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
