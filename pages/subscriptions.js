import authRoutes from '@shopgate/pwa-common/collections/AuthRoutes';
import { appWillStart$ } from '@shopgate/pwa-common/streams/app';

/**
 * App subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function app(subscribe) {
  subscribe(appWillStart$, () => {
    // TODO: use constants for these pathnames
    authRoutes.set('/checkout', '/login');
    authRoutes.set('/item/:productId/write_review', '/login');
  });
}
