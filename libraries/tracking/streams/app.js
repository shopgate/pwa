import { main$ } from '@shopgate/pwa-common/streams/main';
import { getCurrentPathname } from '@shopgate/pwa-common/selectors/router';
import { PWA_DID_APPEAR } from '../constants';

/**
 * Emits when the PWA appeared again after navigating back from a legacy page.
 */
export const pwaDidAppear$ = main$
  .filter(({ action }) => action.type === PWA_DID_APPEAR)
  .map(action => ({
    ...action,
    pathname: getCurrentPathname(),
  }));
