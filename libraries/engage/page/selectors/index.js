import { createSelector } from 'reselect';
import {
  makeGetMenu,
  makeGetIsFetchingMenu,
  getEnableCms2ForAllShoppers,
} from '@shopgate/engage/core/selectors';
import {
  getFulfillmentParams,
  getPopulatedProductsResult,
  SHOPGATE_CATALOG_GET_HIGHLIGHT_PRODUCTS,
} from '@shopgate/engage/product';
import {
  getProductState,
} from '@shopgate/engage/product/selectors/product';
import {
  LEGAL_MENU,
  SORT_PRICE_ASC,
  SORT_PRICE_DESC,
} from '@shopgate/engage/core/constants';
import {
  hasNewServices,
  transformDisplayOptions,
  generateResultHash,
} from '@shopgate/engage/core/helpers';
import { getIsCMS2PreviewEnabled } from '@shopgate/engage/development/selectors';
import { makeGetPageConfigById } from '@shopgate/pwa-common/selectors/page';
import { PRIVACY_PATH } from '../constants';

export * from '@shopgate/pwa-common/selectors/page';

/**
 * Creates a selector that retrieves the privacy policy link.
 *
 * When the new services are active, the link is extracted from the "shopgate.cms.getMenu" response.
 * Otherwise it's a static link to the legacy privacy page.
 * @returns {string|null}
 */
export const makeGetPrivacyPolicyLink = () => {
  const getMenu = makeGetMenu(LEGAL_MENU);
  const getIsFetchingMenu = makeGetIsFetchingMenu(LEGAL_MENU);

  return createSelector(
    getMenu,
    getIsFetchingMenu,
    (menu, fetching) => {
      if (!hasNewServices()) {
        return PRIVACY_PATH;
      }

      if (fetching || !menu) {
        return null;
      }

      const entry = menu.find(item => item.url.includes('privacy')) || {};

      return entry?.url || null;
    }
  );
};

/**
 * @param {Object} state The current application state.
 * @return {Function} A selector function that retrieves the pageV2 state.
 */
const getPageV2State = state => state.pageV2;

/**
 * List of available page types.
 * @typedef {'cms' | 'category'} PageType
 */

/**
 * List of available dropzone types.
 * @typedef {'cmsWidgetList'} DropzoneType
 */

/**
 * Creates a selector that retrieves page data based on the type and slug.
 * @param {Object} params The selector params
 * @param {PageType} [params.type] The type of the page.
 * @param {string|null} [params.slug=null] The slug of the page (optional).
 * @returns {Function} A selector function that retrieves the page data.
 */
export const makeGetPage = ({
  type = 'cms',
  slug = null,
}) => createSelector(
  getPageV2State,
  (pageState) => {
    if (type && slug) {
      return pageState[type]?.[slug] || null;
    }

    return pageState[type] || null;
  }
);

/**
 * Creates a selector that retrieves the widget list from a page based on the type, slug and
 * and dropzone name.
 * @param {Object} params The selector params
 * @param {PageType} [params.type='cms'] The type of the page.
 * @param {DropzoneType} [params.dropzone='cmsWidgetList'] The dropzone name to retrieve the widget
 * list from.
 * @param {string|null} [params.slug=null] The slug of the page (optional).
 * @returns {Function} A selector function that retrieves the widget list.
 */
export const makeGetWidgetsFromPage = ({
  type = 'cms',
  slug = null,
  dropzone = 'cmsWidgetList',
}) => {
  const getPage = makeGetPage({
    type, slug,
  });

  return createSelector(
    getPage,
    (page) => {
      if (!page) {
        return undefined;
      }

      return page.data?.dropzones?.[dropzone] ?? [];
    }
  );
};

/**
 * Determines whether the new CMS version 2 is enabled.
 */
export const getIsCms2Enabled = createSelector(
  getEnableCms2ForAllShoppers,
  getIsCMS2PreviewEnabled,
  (shopSettingEnabled, previewEnabled) => shopSettingEnabled || previewEnabled
);

/**
 * Creates a selector that retrieves unified CMS page data. Depending on the CMS version,
 * the data is retrieved from different sources, but returned in a consistent format.
 * @param {Object} params The selector parameters.
 * @param {string} params.slug The slug of the page.
 * @returns {Function} A selector function that retrieves the unified CMS page data.
 */
export const makeGetUnifiedCMSPageData = ({ slug }) => {
  const getPageV2 = makeGetPage({
    type: 'cms',
    slug,
  });

  const getPageV1 = makeGetPageConfigById({ pageId: slug });

  return createSelector(
    getIsCms2Enabled,
    getPageV1,
    getPageV2,
    (isCms2Enabled, pageV1, pageV2) => {
      if (isCms2Enabled) {
        if (!pageV2) return undefined;

        return {
          isFetching: pageV2?.isFetching ?? false,
          expires: pageV2?.expires ?? null,
          title: pageV2?.data?.pageTitle || pageV2?.data?.name || '',
          widgets: pageV2?.data?.dropzones?.['cmsWidgetList'] ?? [],
          cmsVersion: 2,
          hasError: pageV2?.hasError ?? false,
        };
      }

      if (!pageV1) return undefined;

      return {
        isFetching: pageV1?.isFetching ?? false,
        expires: pageV1?.expires ?? null,
        title: pageV1?.title || '',
        widgets: pageV1?.widgets || [],
        cmsVersion: 1,
        hasError: false,
      };
    }
  );
};

/**
 * Creates a selector that generates a hash to select results for widget products.
 * @param {'searchTerm' | 'productIds' | 'brand' | 'category' |'highlights'} type Type of the
 * request to make.
 * @param {Object} options Request options
 * @param {string} id Unique identifier to find the result in the state.
 * @returns {Function} A selector function that generates a hash for the widget products result.
 */
const makeGetWidgetProductsResultHash = (type, options, id) => {
  const {
    value, sort, useDefaultRequestForProductIds, productIdType,
  } = options;

  const transformedSort = transformDisplayOptions(sort);

  return createSelector(
    getFulfillmentParams,
    (fulfillmentParams) => {
      let hashParams = {};

      switch (type) {
        case 'highlights':
          hashParams = {
            id,
            pipeline: SHOPGATE_CATALOG_GET_HIGHLIGHT_PRODUCTS,
            sort: transformedSort,
          };
          break;
        case 'searchTerm':
        case 'brand':
          hashParams = {
            id,
            searchPhrase: value,
            sort: transformedSort,
            ...fulfillmentParams,
          };
          break;
        case 'productIds':
          hashParams = {
            id,
            productIds: value,
            productIdType,
            ...!useDefaultRequestForProductIds && {
              sort: transformedSort,
            },
            ...fulfillmentParams,
          };

          break;
        case 'category':
          hashParams = {
            id,
            categoryId: value,
            sort: transformedSort,
            ...fulfillmentParams,
          };

          break;
        default:
      }

      return generateResultHash(hashParams, !!hashParams?.sort, false);
    }
  );
};

/**
 * @param {'searchTerm' | 'productIds' | 'brand' | 'category' |'highlights'} type Type of the
 * request to make.
 * @param {Object} options Request options
 * @param {string} id Unique identifier to find the result in the state.
 * @returns {Function} A selector function that retrieves the widget products result by hash.
 */
const makeGetWidgetProductResultsByHash = (type, options, id) => {
  const getWidgetProductResultsHash = makeGetWidgetProductsResultHash(type, options, id);

  return createSelector(
    getProductState,
    getWidgetProductResultsHash,
    (productState, hash) => productState.resultsByHash[hash]
  );
};

/**
 * Creates a selector that collects products for a widget.
 * @param {'searchTerm' | 'productIds' | 'brand' | 'category' |'highlights'} type Type of the
 * request to make.
 * @param {Object} options Request options
 * @param {string} id Unique identifier to find the result in the state.
 * @returns {Function} A selector function that collects products for a widget.
 */
export const makeGetWidgetProducts = (type, options, id) => {
  const getWidgetProductResultsHash = makeGetWidgetProductsResultHash(type, options, id);
  const getWidgetProductResultsByHash = makeGetWidgetProductResultsByHash(type, options, id);

  return createSelector(
    state => state,
    (state, props) => props ?? {},
    getWidgetProductResultsHash,
    getWidgetProductResultsByHash,
    (state, props, resultsHash, resultsByHash) => {
      const result = {
        isFetching: resultsByHash?.isFetching || false,
        ...getPopulatedProductsResult(state, props, resultsHash, resultsByHash),
      };

      // Since the getProducts pipeline does not support sorting when a product ID list is
      // provided, we need to sort the products manually here.
      if (type === 'productIds') {
        if (options.sort === SORT_PRICE_ASC) {
          result.products = result.products.sort(
            (p1, p2) => p1.price.unitPrice - p2.price.unitPrice
          );
        }

        if (options.sort === SORT_PRICE_DESC) {
          result.products = result.products.sort(
            (p1, p2) => p2.price.unitPrice - p1.price.unitPrice
          );
        }
      }

      return result;
    }
  );
};
