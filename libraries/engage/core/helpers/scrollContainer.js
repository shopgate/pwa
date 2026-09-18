import { isAdminPreviewActive } from '@shopgate/engage/admin-preview/helpers';
import { hasWebBridge } from './bridge';

/**
 * Checks whether the app shall use a scroll container
 * @returns {boolean}
 */
export const applyScrollContainer = () => isAdminPreviewActive() || !hasWebBridge();

/**
 * exports the old function name for backwards compatibility
 * @deprecated use applyScrollContainer instead
 * @returns {boolean}
 */
export const useScrollContainer = applyScrollContainer;
