// @flow
import { appWillStart$ } from '@shopgate/pwa-common/streams';
import { fetchConfig } from './config.actions';
import { type SubscribeHandler } from '../../types';

/**
 * Config subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
function config(subscribe: SubscribeHandler) {
  subscribe(appWillStart$, ({ dispatch }) => {
    dispatch(fetchConfig());
  });
}

export default config;
