import { main$ } from '@shopgate/pwa-common/streams/main';
import { routeDidEnter$ } from '@shopgate/pwa-common/streams';
import { RELOAD_APP } from '../constants';
import { historyReset } from '../actions';

/**
 * Gets triggered when the app is supposed to be reloaded
 * @type {Observable}
 */
export const reloadApp$ = main$
  .filter(({ action }) => action.type === RELOAD_APP)
  .switchMap(({ dispatch }) => {
    // The PWA can't be reloaded on any route, so we first need to reset to the index
    dispatch(historyReset());

    return routeDidEnter$
      // Emit when index route is reached
      .filter(({ action }) => action.route.pathname === '/');
  });
