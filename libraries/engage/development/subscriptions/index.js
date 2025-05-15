import { appWillStart$ } from '@shopgate/engage/core/streams';
import { UIEvents } from '@shopgate/engage/core/events';
import { updateStatusBarStyleStorage } from '@shopgate/engage/development/action-creators';

/**
 * Development subscriptions
 * @param {Function} subscribe The subscribe function
 */
export default function development(subscribe) {
  subscribe(appWillStart$, ({ dispatch }) => {
    // Listen for the app event which updates the status bar style and store it into the
    // development storage redux store.
    UIEvents.addListener('devInternalUpdateStatusBarStyle', (event) => {
      dispatch(updateStatusBarStyleStorage(event));
    });
  });
}
