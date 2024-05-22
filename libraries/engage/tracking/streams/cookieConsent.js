import { main$ } from '@shopgate/engage/core/streams';
import { COOKIE_CONSENT_HANDLED, UPDATE_COOKIE_CONSENT } from '../constants';

/**
 * Gets triggered when the cookie consent has been updated by the user or handled already.
 * @type {Observable}
 */
export const cookieConsentSet$ = main$.filter(({ action }) => (
  action.type === UPDATE_COOKIE_CONSENT || action.type === COOKIE_CONSENT_HANDLED
));

/**
 * Gets triggered when the cookie consent has been initially configured by the user or is
 * handled already.
 * @type {Observable}
 */
export const cookieConsentInitialized$ = cookieConsentSet$.first();

/**
 * Gets triggered when cookie consent settings changed after initialization
 * @type {Observable}
 */
export const cookieConsentUpdated$ = cookieConsentSet$
  .distinctUntilChanged(({ action: actionA }, { action: actionB }) =>
    actionA.areComfortCookiesActive !== actionB.areComfortCookiesActive
    || actionA.areStatisticsCookiesActive !== actionB.areStatisticsCookiesActive);

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

/**
 * Gets triggered when comfort cookies where activated first and deactivated afterwards during an
 * app session.
 * @type {Observable}
 */
export const comfortCookiesDeactivated$ = comfortCookiesActivated$
  .switchMap(() => cookieConsentSet$.filter(({ action }) => (
    action.areComfortCookiesActive === false
  )).first());

/**
 * Gets triggered when statistics cookies where activated first and deactivated afterwards during an
 * app session.
 * @type {Observable}
 */
export const statisticsCookiesDeactivated$ = statisticsCookiesActivated$
  .switchMap(() => cookieConsentSet$.filter(({ action }) => (
    action.areStatisticsCookiesActive === false
  )).first());
