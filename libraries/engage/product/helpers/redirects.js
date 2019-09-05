import {
  isBeta, redirects, getThemeSettings, isAfter,
} from '@shopgate/engage/core';
import { ITEM_PATTERN } from '@shopgate/pwa-common-commerce/product/constants';
import { makeGetProductEffectivityDates } from '../selectors/product';

/**
 * Enable redirect handler for effectivity dates and more
 * @returns {void}
 */
export const enableRedirectHandler = () => {
  if (!isBeta()) {
    return;
  }

  /** Effectivity dates */
  const { effectivityDates: { accessExpired } = {} } = getThemeSettings('product') || {};
  if (accessExpired) {
    return;
  }

  const getProductEffectivityDates = makeGetProductEffectivityDates();

  redirects.set(ITEM_PATTERN, ({ action, getState }) => {
    const { params: { pathname }, route: { state: { productId } } } = action;

    const effectivityDates = getProductEffectivityDates(getState(), { productId });
    if (effectivityDates) {
      // Forbid redirect if endDate is expired
      if (effectivityDates.endDate
        && isAfter(new Date(), new Date(effectivityDates.endDate))) {
        return null;
      }
    }
    return pathname;
  });
};
