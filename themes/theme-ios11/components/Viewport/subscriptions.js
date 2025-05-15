import {
  appDidStart$,
  clientInformationDidUpdate$,
} from '@shopgate/engage/core/streams';
import {
  simulatedPageInsetsDidUpdate$,
} from '@shopgate/engage/development/streams';
import { getPageInsets } from '@shopgate/engage/core/selectors';
import { updatePageInsets } from '@shopgate/engage/styles/helpers';

/**
 * App subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function app(subscribe) {
  const pageInsetsNeedUpdate$ = appDidStart$.merge(
    clientInformationDidUpdate$,
    simulatedPageInsetsDidUpdate$
  );

  /**
   * Gets triggered when the page insets changed.
   */
  subscribe(pageInsetsNeedUpdate$, ({ getState }) => {
    updatePageInsets(getPageInsets(getState()));
  });
}
