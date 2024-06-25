import { Observable } from 'rxjs/Observable';
import { ACTION_RESET } from '@virtuous/conductor';
import { main$ } from '@shopgate/pwa-common/streams/main';
import { routeDidEnter$ } from '@shopgate/pwa-common/streams';
import { routeDidEnter } from '@shopgate/pwa-common/action-creators';
import { getRouterStack } from '@shopgate/engage/core/selectors';
import { RELOAD_APP } from '../constants';
import { historyReset } from '../actions';

/**
 * Gets triggered when the app is supposed to be reloaded
 * @type {Observable}
 */
export const reloadApp$ = main$
  .filter(({ action }) => action.type === RELOAD_APP)
  .switchMap((params) => {
    const { dispatch, getState } = params;

    const [initialRoute, ...otherRoutes] = getRouterStack(getState());

    if (!otherRoutes.length) {
      // When the initial route is the only route inside the router stack, routeDidEnter$ will
      // not always be triggered, so just simulate it here.
      return Observable.of({
        ...params,
        action: routeDidEnter(initialRoute, ACTION_RESET),
      });
    }

    // The PWA can't be reloaded on any route, so we first need to reset to the first history entry
    dispatch(historyReset());

    return routeDidEnter$
      // Emit when initial route is reached
      .filter(({ action }) => action.route.id === initialRoute?.id);
  });
