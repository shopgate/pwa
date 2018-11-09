import { router } from '@virtuous/conductor';
import { main$ } from '@shopgate/pwa-common/streams/main';
import { PWA_DID_APPEAR } from '../constants';

/**
 * Emits when the PWA appeared again after navigating back from a legacy page.
 */
export const pwaDidAppear$ = main$
  .filter(({ action }) => action.type === PWA_DID_APPEAR)
  .map(params => ({
    ...params,
    action: {
      ...params.action,
      route: router.getCurrentRoute(),
    },
  }));
