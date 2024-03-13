import { getCurrentRoute } from '../selectors/router';
import {
  APP_WILL_INIT,
  APP_DID_START,
  APP_WILL_START,
  PWA_DID_APPEAR,
  PWA_DID_DISAPPEAR,
} from '../constants/ActionTypes';
import { main$ } from './main';

export const appWillInit$ = main$
  .filter(({ action }) => action.type === APP_WILL_INIT);

/**
 * Gets triggered before the app starts.
 * @type {Observable}
 */
export const appWillStart$ = main$
  .filter(({ action }) => action.type === APP_WILL_START);

/**
 * Gets triggered when the app starts.
 * @type {Observable}
 */
export const appDidStart$ = main$
  .filter(({ action }) => action.type === APP_DID_START);

/**
 * Emits when the PWA appeared again after navigating back from a legacy page.
 */
export const pwaDidAppear$ = main$
  .filter(({ action }) => action.type === PWA_DID_APPEAR)
  .map(params => ({
    ...params,
    action: {
      ...params.action,
      route: getCurrentRoute(params.getState()),
    },
  }));

/**
 * Emits when the PWA disappears
 */
export const pwaDidDisappear$ = main$
  .filter(({ action }) => action.type === PWA_DID_DISAPPEAR)
  .map(params => ({
    ...params,
    action: {
      ...params.action,
      route: getCurrentRoute(params.getState()),
    },
  }));
