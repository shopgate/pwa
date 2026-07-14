export const PAGE_PREVIEW_PATTERN = '/shopgate-internal-page-preview';

/**
 * Whether the app is currently in page admin preview mode.
 */
export const IS_PAGE_ADMIN_PREVIEW_ACTIVE = window
  .location
  .pathname
  .startsWith(PAGE_PREVIEW_PATTERN);

/**
 * Whether the app is currently in frontend settings admin preview mode.
 */
export const IS_FRONTEND_SETTINGS_ADMIN_PREVIEW_ACTIVE = window
  .location
  .search
  .includes('frontendSettingsPreview=true');

/**
 * Whether the app is currently in admin preview mode (pages or frontend settings).
 */
export const IS_ADMIN_PREVIEW_ACTIVE = IS_PAGE_ADMIN_PREVIEW_ACTIVE
  || IS_FRONTEND_SETTINGS_ADMIN_PREVIEW_ACTIVE;

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
