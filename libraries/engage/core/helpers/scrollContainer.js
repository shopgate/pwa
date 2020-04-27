import { hasWebBridge } from './bridge';

/**
 * Checks whether the app shall use a scroll container
 * @returns {boolean}
 */
export const useScrollContainer = () => !hasWebBridge();
