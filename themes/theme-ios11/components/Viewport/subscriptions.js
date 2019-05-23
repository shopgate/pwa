import { appDidStart$ } from '@shopgate/engage/core';
import { getPageInsets } from '@shopgate/engage/core';
import { clientInformationDidUpdate$ } from '@shopgate/engage/core';
import { updatePageInsets } from './style';
/**
 * App subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function app(subscribe) {
  const pageInsetsNeedUpdate$ = appDidStart$.merge(clientInformationDidUpdate$);

  /**
   * Gets triggered when the page insets changed.
   */
  subscribe(pageInsetsNeedUpdate$, ({ getState }) => {
    updatePageInsets(getPageInsets(getState()));
  });
}
