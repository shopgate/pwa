import { appDidStart$ } from '@shopgate/pwa-common/streams/app';
import { clientInformationDidUpdate$ } from '@shopgate/pwa-common/streams/client';
import { getPageInsets } from './selectors';
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
