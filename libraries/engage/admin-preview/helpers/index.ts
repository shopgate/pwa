import {
  IS_ADMIN_PREVIEW_ACTIVE,
  IS_FRONTEND_SETTINGS_ADMIN_PREVIEW_ACTIVE,
  IS_PAGE_ADMIN_PREVIEW_ACTIVE,
} from '../constants';

/**
 * Checks if the app is currently in admin preview mode (pages or frontend settings).
 * @returns True if the app is in admin preview mode, false otherwise.
 */
export const isAdminPreviewActive = (): boolean =>
  IS_ADMIN_PREVIEW_ACTIVE;

/**
 * Checks if the app is currently in page admin preview mode.
 * @returns True if the app is in page admin preview mode, false otherwise.
 */
export const isPageAdminPreviewActive = (): boolean =>
  IS_PAGE_ADMIN_PREVIEW_ACTIVE;

/**
 * Checks if the app is currently in frontend settings admin preview mode.
 * @returns True if the app is in frontend settings admin preview mode, false otherwise.
 */
export const isFrontendSettingsAdminPreviewActive = (): boolean =>
  IS_FRONTEND_SETTINGS_ADMIN_PREVIEW_ACTIVE;
