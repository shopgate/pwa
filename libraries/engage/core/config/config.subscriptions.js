import { appWillStart$ } from '@shopgate/pwa-common/streams';
import { fetchConfig } from './config.actions';

/**
 * Config subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
function config(subscribe) {
  subscribe(appWillStart$, ({ dispatch }) => {
    dispatch(fetchConfig());
  });
}

export default config;
