import {
  SORT_RELEVANCE,
} from '@shopgate/pwa-common/constants/DisplayOptions';

// Scopes for the sort order
export const SORT_SCOPE_CATEGORY = 'sortScopeCategory';
export const SORT_SCOPE_SEARCH = 'sortScopeSearch';

// Sort order parameters which are supported by the pipelines
export const SORT_ORDER_RELEVANCE = SORT_RELEVANCE;

export const SORT_ORDER_PRICE_ASC = 'priceAsc';
export const SORT_ORDER_PRICE_DESC = 'priceDesc';
export const SORT_ORDER_NAME_ASC = 'nameAsc';
export const SORT_ORDER_NAME_DESC = 'nameDesc';
export const SORT_ORDER_RANK_ASC = 'rankAsc';
export const SORT_ORDER_RANK_DESC = 'rankDesc';

/**
 * Checks if a sort order is supported
 * @param {string} sortOrder The sort order to check
 * @returns {boolean}
 */
export const isSortOrderSupported = sortOrder => [
  SORT_ORDER_PRICE_ASC,
  SORT_ORDER_PRICE_DESC,
  SORT_ORDER_NAME_ASC,
  SORT_ORDER_NAME_DESC,
  SORT_ORDER_RANK_ASC,
  SORT_ORDER_RANK_DESC,
].includes(sortOrder);

const shopSettingsOrderMapping = {
  'name:asc': SORT_ORDER_NAME_ASC,
  'name:desc': SORT_ORDER_NAME_DESC,
  'rank:asc': SORT_ORDER_RANK_ASC,
  'rank:desc': SORT_ORDER_RANK_DESC,
  'price:asc': SORT_ORDER_PRICE_ASC,
  'price:desc': SORT_ORDER_PRICE_DESC,
};

/**
 * Maps the sort order from the shop settings to one of the regular ones
 * @param {string} sortOrder The sort order
 * @returns {string}
 */
export const mapSortOrderFromShopSettings = sortOrder => shopSettingsOrderMapping[sortOrder];
