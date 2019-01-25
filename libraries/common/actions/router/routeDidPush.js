import { ACTION_PUSH, getRouteById, getPreviousRoute } from '@shopgate/pwa-common/helpers/router';
import * as actions from '../../action-creators/router';

/**
 * @param {string} id A route ID.
 * @returns {Function}
 */
export function routeDidPush(id) {
  return (dispatch) => {
    const route = getRouteById(id);
    const prevRoute = getPreviousRoute();

    if (prevRoute) {
      dispatch(actions.routeDidLeave(prevRoute, ACTION_PUSH));
    }

    dispatch(actions.routeDidEnter(route, ACTION_PUSH));
  };
}
