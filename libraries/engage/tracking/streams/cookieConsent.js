import { main$ } from '@shopgate/engage/core/streams';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';
import { COOKIE_CONSENT_HANDLED, UPDATE_COOKIE_CONSENT } from '../constants';

/**
 * Gets triggered when the cookie consent has been updated by the user or handled already.
 * This stream is only for internal usage and will be triggered independent of changed payload.
 * @type {Observable}
 */
const cookieConsentSetInternal$ = main$.filter(({ action }) => (
  action.type === UPDATE_COOKIE_CONSENT || action.type === COOKIE_CONSENT_HANDLED
));

/**
 * Gets triggered when the cookie consent has been initially configured by the user or is
 * handled already.
 * @type {Observable}
 */
export const cookieConsentInitialized$ = cookieConsentSetInternal$.first();

/**
 * Gets triggered when cookie consent settings changed after initialization
 * @type {Observable}
 */
export const cookieConsentUpdated$ = cookieConsentSetInternal$
  .pairwise()
  .filter(([{ action: actionPrev }, { action: actionCurrent }]) =>
    actionPrev.comfortCookiesAccepted !== actionCurrent.comfortCookiesAccepted
      || actionPrev.statisticsCookiesAccepted !== actionCurrent.statisticsCookiesAccepted)
  .switchMap(([, latest]) => Observable.of(latest));

/**
 * Gets triggered when the cookie consent has been updated by the user or handled already.
 * @type {Observable}
 */
export const cookieConsentSet$ = cookieConsentInitialized$.merge(cookieConsentUpdated$);

/**
 * Gets triggered when the cookie consent has been set either by user or merchant.
 * @type {Observable}
 */
export const comfortCookiesAccepted$ = cookieConsentSet$.filter(({ action }) => (
  action.comfortCookiesAccepted === true
));

/**
 * Gets triggered when the cookie consent has been set either by user or merchant.
 * @type {Observable}
 */
export const statisticsCookiesAccepted$ = cookieConsentSet$.filter(({ action }) => (
  action.statisticsCookiesAccepted === true
));

/**
 * Gets triggered when comfort cookies where accepted first and declined afterwards during an
 * app session.
 * @type {Observable}
 */
export const comfortCookiesDeclined$ = comfortCookiesAccepted$
  .switchMap(() => cookieConsentSet$.filter(({ action }) => (
    action.comfortCookiesAccepted === false
  )).first());

/**
 * Gets triggered when statistics cookies where accepted first and declined afterwards during an
 * app session.
 * @type {Observable}
 */
export const statisticsCookiesDeclined$ = statisticsCookiesAccepted$
  .switchMap(() => cookieConsentSet$.filter(({ action }) => (
    action.statisticsCookiesAccepted === false
  )).first());
