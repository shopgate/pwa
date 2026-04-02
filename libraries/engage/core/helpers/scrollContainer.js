import { IS_PAGE_PREVIEW_ACTIVE } from '@shopgate/engage/page/constants';
import { hasWebBridge } from './bridge';

/**
 * Checks whether the app shall use a scroll container
 * @returns {boolean}
 */
export const applyScrollContainer = () => IS_PAGE_PREVIEW_ACTIVE || !hasWebBridge();

/**
 * exports the old function name for backwards compatibility
 * @deprecated use applyScrollContainer instead
 * @returns {boolean}
 */
export const useScrollContainer = applyScrollContainer;
