import { ACTION_RESET, getCurrentRoute } from '@shopgate/pwa-common/helpers/router';
import * as actions from '../../action-creators/router';
import { getCurrentRoute as getCurrentRouteSelector } from '../../selectors/router';

/**
 * @returns {Function}
 */
export function routeWillReset() {
  return (dispatch, getState) => {
    const incoming = getCurrentRoute();
    const outgoing = getCurrentRouteSelector(getState());

    dispatch(actions.routeWillLeave(outgoing, ACTION_RESET));
    dispatch(actions.routeWillEnter(incoming, ACTION_RESET));
  };
}
