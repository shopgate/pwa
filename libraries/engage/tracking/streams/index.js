import { main$ } from '@shopgate/pwa-common/streams';
import { COOKIE_CONSENT_DONE } from '../constants';

/**
 * Gets triggered when the cookie consent has been handled by the user.
 * @type {Observable}
 */
export const cookieConsentDone$ = main$.filter(({ action }) => (
  action.type === COOKIE_CONSENT_DONE
));

/**
 * Gets triggered when the cookie consent has been handled by the user.
 * @type {Observable}
 */
export const comfortCookieActivated$ = cookieConsentDone$.filter(({ action }) => (
  action.areComfortCookiesSelected === true
));

/**
 * Gets triggered when the cookie consent has been handled by the user.
 * @type {Observable}
 */
export const statisticsCookiesActivated$ = cookieConsentDone$.filter(({ action }) => (
  action.areStatisticsCookiesSelected === true
));

