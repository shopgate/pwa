import { isBeta, redirects, getSettings, isAfter } from '@shopgate/engage/core';
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
  const { accessExpired = true } = getSettings('@shopgate/engage/product/EffectivityDates') || {};
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
        && isAfter(Date.now(), new Date(effectivityDates.endDate))) {
        return null;
      }
    }
    return pathname;
  });
};
