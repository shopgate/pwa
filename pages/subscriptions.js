import authRoutes from '@shopgate/pwa-common/collections/AuthRoutes';
import { appWillStart$ } from '@shopgate/pwa-common/streams/app';
import { routeWillEnter$ } from '@shopgate/pwa-common/streams/router';
import ToastProvider from '@shopgate/pwa-common/providers/toast';

/**
 * App subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function app(subscribe) {
  subscribe(appWillStart$, () => {
    // TODO: use constants for these pathnames
    // TODO: move checkout route protectuion to checkout extension
    authRoutes.set('/checkout', '/login');
    authRoutes.set('/item/:productId/write_review', '/login');
  });

  subscribe(routeWillEnter$, ({ events }) => {
    events.emit(ToastProvider.FLUSH);
  });
}
