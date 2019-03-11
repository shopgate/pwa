import { getCurrentRoute } from '@shopgate/pwa-common/selectors/router';
import { main$ } from '@shopgate/pwa-common/streams/main';
import {
  PWA_DID_APPEAR,
  PWA_DID_DISAPPEAR,
} from '../constants';

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

/**
 * Emits when the PWA visibility changes
 */
export const pwaVisibility$ = pwaDidAppear$.merge(pwaDidDisappear$);
