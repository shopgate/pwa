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
