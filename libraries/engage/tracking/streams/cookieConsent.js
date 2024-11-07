import { main$, routeWillEnter$ } from '@shopgate/engage/core/streams';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';
import { makeGetPrivacyPolicyLink } from '@shopgate/engage/page/selectors';
import {
  COOKIE_CONSENT_HANDLED,
  UPDATE_COOKIE_CONSENT,
  PRIVACY_SETTINGS_PATTERN,
} from '../constants';
import {
  getIsCookieConsentHandled,
} from '../selectors/cookieConsent';

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
 * Gets triggered when the cookie consent was initialized / handled by user. In that case
 * the UPDATE_COOKIE_CONSENT action is dispatched. When handled automatically the
 * COOKIE_CONSENT_HANDLED action is dispatched.
 */
export const cookieConsentInitializedByUserInternal$ = cookieConsentInitialized$
  .filter(({ action }) => action.type === UPDATE_COOKIE_CONSENT);

/**
 * Gets triggered when the user interacted with the buttons on the privacy settings page,
 * but no settings was changed. Needed to navigate back to the previous page.
 * When a setting was changed, the "cookieConsentUpdated$" stream triggers which will cause
 * an app reload.
 * @type {Observable}
 */
export const privacySettingsConfirmedWithoutChangeInternal$ = cookieConsentSetInternal$
  .pairwise()
  .filter(([{ action: actionPrev }, { action: actionCurrent }]) =>
    actionPrev.comfortCookiesAccepted === actionCurrent.comfortCookiesAccepted
    && actionPrev.statisticsCookiesAccepted === actionCurrent.statisticsCookiesAccepted)
  .switchMap(([, latest]) => Observable.of(latest));

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

/**
 * Emit when the cookie consent modal is supposed to be shown / hidden on route changes.
 *
 * When cookie consent is not handled yet, the modal should overlay every route, except the
 * pages with privacy polity and privacy settings when extended consent decisions are taken.
 */
export const cookieConsentModalShouldToggleInternal$ = routeWillEnter$
  // Stop the stream after cookie consent is handled
  .takeUntil(cookieConsentInitialized$)
  .switchMap((input) => {
    const { action, getState } = input;
    const isCookieConsentHandled = getIsCookieConsentHandled(getState());

    let showConsentModal = false;

    // Only run extended logic when cookie consent is active and still need to be handled
    if (!isCookieConsentHandled) {
      const pagesWithoutModal = [
        PRIVACY_SETTINGS_PATTERN,
        makeGetPrivacyPolicyLink()(getState()),
      ];

      showConsentModal = !pagesWithoutModal.includes(action?.route?.pathname);
    }

    return Observable.of({
      ...input,
      showConsentModal,
    });
  });
