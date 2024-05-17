import { main$ } from '@shopgate/pwa-common/streams';
import { COOKIE_CONSENT_HANDLED, UPDATE_COOKIE_CONSENT } from '../constants';

/**
 * Gets triggered when the cookie consent has been updated by the user or handled already.
 * @type {Observable}
 */
export const cookieConsentSet$ = main$.filter(({ action }) => (
  action.type === UPDATE_COOKIE_CONSENT || action.type === COOKIE_CONSENT_HANDLED
));

/**
 * Gets triggered when the cookie consent has been set either by user or merchant.
 * @type {Observable}
 */
export const comfortCookiesActivated$ = cookieConsentSet$.filter(({ action }) => (
  action.areComfortCookiesActive === true
));

/**
 * Gets triggered when the cookie consent has been set either by user or merchant.
 * @type {Observable}
 */
export const statisticsCookiesActivated$ = cookieConsentSet$.filter(({ action }) => (
  action.areStatisticsCookiesActive === true
));

