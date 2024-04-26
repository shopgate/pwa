import { main$ } from '@shopgate/pwa-common/streams';
import { UPDATE_COOKIE_CONSENT } from '../constants';

/**
 * Gets triggered when the cookie consent has been handled by the user.
 * @type {Observable}
 */
export const cookieConsentUpdated$ = main$.filter(({ action }) => (
  action.type === UPDATE_COOKIE_CONSENT
));

/**
 * Gets triggered when the cookie consent has been handled by the user.
 * @type {Observable}
 */
export const comfortCookieActivated$ = cookieConsentUpdated$.filter(({ action }) => (
  action.areComfortCookiesActive === true
));

/**
 * Gets triggered when the cookie consent has been handled by the user.
 * @type {Observable}
 */
export const statisticsCookiesActivated$ = cookieConsentUpdated$.filter(({ action }) => (
  action.areStatisticsCookiesActive === true
));

