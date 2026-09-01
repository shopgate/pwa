import { appWillStart$ } from '@shopgate/engage/core/streams';
import { UIEvents } from '@shopgate/engage/core/events';
import { updateStatusBarStyleStorage } from '@shopgate/engage/development/action-creators';
import type { StatusBarStyle } from '../types';

/**
 * The subset of the subscription helpers this module uses.
 */
interface SubscriptionContext {
  dispatch: (action: unknown) => void;
}

type Subscribe = (
  stream: typeof appWillStart$,
  callback: (context: SubscriptionContext) => void
) => void;

/**
 * Development subscriptions.
 * @param subscribe The subscribe function.
 */
export default function development(subscribe: Subscribe) {
  subscribe(appWillStart$, ({ dispatch }) => {
    // Listen for the app event which updates the status bar style and store it into the
    // development storage redux store.
    UIEvents.addListener('devInternalUpdateStatusBarStyle', (event: StatusBarStyle) => {
      dispatch(updateStatusBarStyleStorage(event));
    });
  });
}
