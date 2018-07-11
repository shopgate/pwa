import event from '@shopgate/pwa-core/classes/Event';
import { EVENT_PIPELINE_ERROR } from '@shopgate/pwa-core/constants/Pipeline';
import authRoutes from '@shopgate/pwa-common/collections/AuthRoutes';
import { appWillStart$, appDidStart$ } from '@shopgate/pwa-common/streams/app';
import pipelineErrorDialog from '@shopgate/pwa-ui-shared/Dialog/actions/pipelineErrorDialog';

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

  subscribe(appDidStart$, ({ dispatch, events }) => {
    // Add event callbacks.
    event.addCallback(EVENT_PIPELINE_ERROR, params => dispatch(pipelineErrorDialog(params)));
  });
}
