import { appWillStart$ } from '@shopgate/pwa-common/streams';
import { hasNewServices } from '@shopgate/engage/core/helpers';
import { fetchConfig } from './config.actions';

/**
 * Config subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
function config(subscribe) {
  subscribe(appWillStart$, ({ dispatch }) => {
    if (hasNewServices()) {
      dispatch(fetchConfig());
    }
  });
}

export default config;
