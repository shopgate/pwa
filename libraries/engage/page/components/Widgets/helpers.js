import { PAGE_PREVIEW_PATTERN } from '@shopgate/engage/page/constants';

/**
 * Retrieves the scroll container for the current page. Depending on the PWA mode this can be
 * a scrollable article element or the window.
 * @returns {HTMLElement|null}
 */
export const getScrollContainer = () => document.querySelector(`.route__${PAGE_PREVIEW_PATTERN.replace(/^\/+/, '')}`);
