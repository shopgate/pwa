import { appWillStart$ } from '@shopgate/engage/core/streams';
import { configuration } from '@shopgate/engage/core/collections';
import { hasNewServices } from '@shopgate/engage/core/helpers';
import { CONFIGURATION_COLLECTION_KEY_BASE_URL } from '@shopgate/engage/core/constants';
import { reloadApp$ } from '../streams';
import { reloadApp } from '../action-creators';

/**
 * App subscriptions
 * @param {Function} subscribe The subscribe function
 */
export default function app(subscribe) {
  subscribe(appWillStart$, ({ dispatch }) => {
    console.log(`%cℹ️ PWA uses ${hasNewServices() ? 'NEW' : 'OLD'} services`, 'color: blue');

    // Add global function to enable PWA reload from the console
    window.reloadSGApp = () => {
      dispatch(reloadApp());
    };
  });

  subscribe(reloadApp$, () => {
    // A deployed app can only be reloaded on the base url. So we first set this as current route
    // before the reload happens.
    window.history.replaceState({}, null, configuration.get(CONFIGURATION_COLLECTION_KEY_BASE_URL));
    window.location.reload();
  });
}
