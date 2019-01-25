import { ACTION_RESET, getCurrentRoute } from '@shopgate/pwa-common/helpers/router';
import * as actions from '../../action-creators/router';
import { getCurrentRoute as getCurrentRouteSelector } from '../../selectors/router';

/**
 * @param {Route} prev The previous route.
 * @param {Route} next The next route.
 * @returns {Function}
 */
export function routeDidReset() {
  return (dispatch, getState) => {
    const incoming = getCurrentRoute();
    const outgoing = getCurrentRouteSelector(getState());

    dispatch(actions.routeDidLeave(outgoing, ACTION_RESET));
    dispatch(actions.routeDidEnter(incoming, ACTION_RESET));
  };
}
