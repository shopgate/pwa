import { createSelector } from 'reselect';
import {
  makeGetMenu,
  makeGetIsFetchingMenu,
  makeGetShopSettingByKey,
  SHOP_SETTING_COOKIE_CONSENT_MODE,
  hasWebBridge,
} from '@shopgate/engage/core';
import { LEGAL_MENU } from '@shopgate/pwa-common/constants/MenuIDs';
import {
  COOKIE_CONSENT_MODE_OFF,
  COOKIE_CONSENT_MODE_STANDARD,
  COOKIE_CONSENT_MODE_STRICT,
} from '../constants';

/**
 * Creates a selector that retrieves the privacy polity link.
 * @returns {string}
 */
export const makeGetPrivacyPolicyLink = () => {
  const getMenu = makeGetMenu(LEGAL_MENU);
  const getIsFetchingMenu = makeGetIsFetchingMenu(LEGAL_MENU);

  return createSelector(
    getMenu,
    getIsFetchingMenu,
    (menu, fetching) => {
      if (fetching || !menu) {
        return null;
      }

      const entry = menu.find(item => item.url.includes('privacy')) || {};

      return entry?.url || null;
    }
  );
};

const getCookieConsentShopSetting = makeGetShopSettingByKey(
  SHOP_SETTING_COOKIE_CONSENT_MODE, COOKIE_CONSENT_MODE_OFF
);

export const hasCookieConsent = createSelector(
  getCookieConsentShopSetting,
  (setting) => {
    if (!hasWebBridge()) {
      return false;
    }

    return [COOKIE_CONSENT_MODE_STANDARD, COOKIE_CONSENT_MODE_STRICT].includes(setting);
  }
);

export const hasStrictCookieConsent = createSelector(
  getCookieConsentShopSetting,
  setting => setting === COOKIE_CONSENT_MODE_STRICT
);
