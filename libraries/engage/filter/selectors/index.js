import { createSelector } from 'reselect';
import { SORT_RELEVANCE } from '@shopgate/pwa-common/constants/DisplayOptions';
import {
  SHOP_SETTING_PRODUCTS_SORT_ORDER,
} from '../../core/constants';
import {
  SORT_ORDER_RANK_DESC,
  SORT_SCOPE_CATEGORY,
  SORT_SCOPE_SEARCH,
  SORT_ORDER_NAME_ASC,
  isSortOrderSupported,
  mapSortOrderFromShopSettings,
} from '../constants/sort';
import { makeGetShopSettingByKey } from '../../core/selectors/shopSettings';

export * from '@shopgate/pwa-common-commerce/filter/selectors';

/**
 * Tries to determine the sort scope by selector props.
 * @param {Object} props Selector props.
 * @returns {string}
 */
const getScopeFromProps = ({ scope, categoryId, searchPhrase }) => {
  if (scope) {
    return scope;
  }

  if (typeof searchPhrase !== 'undefined') {
    return SORT_SCOPE_SEARCH;
  }

  if (categoryId) {
    return SORT_SCOPE_CATEGORY;
  }

  return SORT_SCOPE_CATEGORY;
};

/**
 * Creates a selector to determine if extended sort options are supported
 * @returns {Function}
 */
export const makeExtendedSortOptionsSupported = () => {
  const getShopSettingByKey = makeGetShopSettingByKey(
    SHOP_SETTING_PRODUCTS_SORT_ORDER,
    SORT_RELEVANCE
  );

  return createSelector(
    getShopSettingByKey,
    sortOrderByShopSettings => sortOrderByShopSettings !== SORT_RELEVANCE

  );
};

/**
 * Creates a selector to retrieve a default sort order for product requests
 * @returns {Function}
 */
export const makeGetDefaultSortOrder = () => {
  const getShopSettingByKey = makeGetShopSettingByKey(
    SHOP_SETTING_PRODUCTS_SORT_ORDER,
    SORT_RELEVANCE
  );

  return createSelector(
    (state, props = {}) => getScopeFromProps(props),
    getShopSettingByKey,
    (scope, sortOrderByShopSettings) => {
      if (sortOrderByShopSettings === SORT_RELEVANCE) {
        /**
         * The "relevance" order is not available within the extended sort options. This indicates
         * that the default sort system is in place. So we just return the value.
         */
        return sortOrderByShopSettings;
      }

      if (scope === SORT_SCOPE_SEARCH) {
        // For "search" we don't have a shop config yet to configure the default order.
        return SORT_ORDER_RANK_DESC;
      }

      // The sort order from the shop settings has format which is not accepted by the pipelines.
      const convertedSortOrder = mapSortOrderFromShopSettings(sortOrderByShopSettings);

      if (!isSortOrderSupported(convertedSortOrder)) {
        // Fallback for potential unsupported shop settings
        return SORT_ORDER_NAME_ASC;
      }

      return convertedSortOrder;
    }
  );
};
