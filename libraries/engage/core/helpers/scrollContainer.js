import { IS_PAGE_PREVIEW_ACTIVE } from '@shopgate/engage/page/constants';
import { hasWebBridge } from './bridge';

/**
 * Checks whether the app shall use a scroll container
 * @returns {boolean}
 */
export const useScrollContainer = () => IS_PAGE_PREVIEW_ACTIVE || !hasWebBridge();
