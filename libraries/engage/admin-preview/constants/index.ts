import {
  detectAdminPreview,
  detectFrontendSettingsAdminPreview,
  detectPageAdminPreview,
} from '../detection';

export { PAGE_PREVIEW_PATTERN } from '../detection';

/**
 * Whether the app is currently in page admin preview mode.
 *
 * Snapshot taken when this module is first evaluated. Prefer the isPageAdminPreviewActive()
 * helper, which re-evaluates on every call.
 */
export const IS_PAGE_ADMIN_PREVIEW_ACTIVE = detectPageAdminPreview();

/**
 * Whether the app is currently in frontend settings admin preview mode.
 *
 * Snapshot taken when this module is first evaluated. Prefer the
 * isFrontendSettingsAdminPreviewActive() helper, which re-evaluates on every call.
 */
export const IS_FRONTEND_SETTINGS_ADMIN_PREVIEW_ACTIVE = detectFrontendSettingsAdminPreview();

/**
 * Whether the app is currently in admin preview mode (pages or frontend settings).
 *
 * Snapshot taken when this module is first evaluated. Prefer the isAdminPreviewActive() helper,
 * which re-evaluates on every call.
 */
export const IS_ADMIN_PREVIEW_ACTIVE = detectAdminPreview();

/**
 * List of allowed origins for cms page preview iFrame communication.
 */
export const ALLOWED_ADMIN_PREVIEW_ORIGINS = [
  'https://next.admin.shopgatedev.com',
  'https://next.admin.shopgatepg.com',
  'https://next.admin.shopgate.com',
  'https://next.us.admin.shopgate.com',
  'http://localhost:1337',
];
