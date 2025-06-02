import { createSelector } from 'reselect';
import { makeGetMenu, makeGetIsFetchingMenu } from '@shopgate/engage/core/selectors';
import { LEGAL_MENU } from '@shopgate/engage/core/constants';
import { hasNewServices } from '@shopgate/engage/core';
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
 * @return {Object}
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
 * @param {string} [params.slug=null] The slug of the page (optional).
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
 * @param {PageType} params.type The type of the page.
 * @param {DropzoneType} params.dropzone The dropzone name to retrieve the widget list from.
 * @param {string} [params.slug=null] The slug of the page (optional).
 * @returns {Function} A selector function that retrieves the widget list.
 */
export const makeGetWidgetListFromPage = ({
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

      return (page.data?.dropzones ?? []).find(entry => entry.dropzone === dropzone)?.widgetList;
    }
  );
};
