import { ACTION_PUSH, getPreviousRoute, getRouteById } from '@shopgate/pwa-common/helpers/router';
import * as actions from '../../action-creators/router';

/**
 * @param {string} id A route ID.
 * @returns {Function}
 */
export function routeWillPush(id) {
  return (dispatch) => {
    const route = getRouteById(id);
    const prevRoute = getPreviousRoute();

    if (prevRoute) {
      dispatch(actions.routeWillLeave(prevRoute, ACTION_PUSH));
    }

    dispatch(actions.routeWillEnter(route, ACTION_PUSH));
  };
}
