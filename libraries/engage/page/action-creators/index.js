import {
  REQUEST_PAGE_CONFIG_V2,
  RECEIVE_PAGE_CONFIG_V2,
  ERROR_PAGE_CONFIG_V2,
} from '../constants';

/**
 * @typedef {'cms' | 'category'} PageType
 */

/**
 * Creates the dispatched REQUEST_PAGE_CONFIG_V2 action object.
 * @param {Object} params The action params
 * @param {PageType} [params.type="cms"] The type of the page.
 * @param {string} [params.slug=null] The slug of the page (optional).
 * @returns {Object} The dispatched action object.
 */
export const requestPageConfigV2 = ({ type = 'cms', slug = null }) => ({
  type: REQUEST_PAGE_CONFIG_V2,
  pageType: type,
  pageSlug: slug,
});

/**
 * Creates the dispatched RECEIVE_PAGE_CONFIG_V2 action object.
 * @param {Object} params The action params
 * @param {PageType} [params.type="cms"] The type of the page.
 * @param {Object} params.data The page data
 * @param {string} [params.slug=null] The slug of the page (optional).
 * @returns {Object} The dispatched action object.
 */
export const receivePageConfigV2 = ({ type = 'cms', data, slug = null }) => ({
  type: RECEIVE_PAGE_CONFIG_V2,
  pageType: type,
  pageSlug: slug,
  data,
});

/**
 * Creates the dispatched ERROR_PAGE_CONFIG_V2 action object.
 * @param {Object} params The action params
 * @param {PageType} [params.type="cms"] The type of the page.
 * @param {string} [params.slug=null] The slug of the page (optional).
 * @returns {Object} The dispatched action object.
 */
export const errorPageConfigV2 = ({ type = 'cms', slug = null }) => ({
  type: ERROR_PAGE_CONFIG_V2,
  pageType: type,
  pageSlug: slug,
});
