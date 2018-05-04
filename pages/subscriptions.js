import event from '@shopgate/pwa-core/classes/Event';
import { EVENT_PIPELINE_ERROR } from '@shopgate/pwa-core/constants/Pipeline';
import { appDidStart$ } from '@shopgate/pwa-common/streams/app';
import pipelineErrorDialog from '@shopgate/pwa-ui-shared/Dialog/actions/pipelineErrorDialog';

/**
 * App subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function app(subscribe) {
  /**
   * Gets triggered when the app starts.
   */
  subscribe(appDidStart$, ({ dispatch }) => {
    // Add event callbacks.
    event.addCallback(EVENT_PIPELINE_ERROR, params => dispatch(pipelineErrorDialog(params)));
  });
}
