import { fetchPageConfig } from './fetchPageConfig';

/**
 * Retrieves the config for a page.
 * @param {string} pageId The ID of the page to request.
 * @param {boolean} [force=true] When true, the request will go out without being checked.
 * @return {Function} The dispatched action.
 * @deprecated
 */
const getPageConfig = fetchPageConfig;

export default getPageConfig;
