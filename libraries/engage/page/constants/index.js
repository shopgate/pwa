import { IS_ADMIN_PREVIEW_ACTIVE } from '@shopgate/engage/admin-preview/constants';
import { PAGE_PATH, PAGE_PATTERN } from '@shopgate/pwa-common/constants/RoutePaths';

export { PAGE_PREVIEW_PATTERN } from '@shopgate/engage/admin-preview/constants';

export * from '@shopgate/pwa-common/constants/PageIDs';
export { PAGE_PATH, PAGE_PATTERN };
export * from './actionTypes';

export const IMPRINT_PATH = `${PAGE_PATH}/imprint`;
export const PAYMENT_PATH = `${PAGE_PATH}/payment`;
export const PRIVACY_PATH = `${PAGE_PATH}/privacy`;
export const RETURN_POLICY_PATH = `${PAGE_PATH}/return_policy`;
export const SHIPPING_PATH = `${PAGE_PATH}/shipping`;
export const TERMS_PATH = `${PAGE_PATH}/terms`;

export const PAGE_PREVIEW_SLUG = 'page_preview';

/**
 * Checks if the app is currently in page preview mode.
 * @todo For backwards compatibility, this constant is still exported from the page package and
 * mapped to the IS_ADMIN_PREVIEW_ACTIVE constant. It should be removed in the future.
 */
export const IS_PAGE_PREVIEW_ACTIVE = IS_ADMIN_PREVIEW_ACTIVE;

/**
 * One hour in milliseconds
 */
export const PAGE_STATE_LIFETIME = 3600000;
