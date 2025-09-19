import { appWillStart$ } from '@shopgate/engage/core/streams';

/**
 * Page subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function page(subscribe) {
  subscribe(appWillStart$, () => {

  });
}
