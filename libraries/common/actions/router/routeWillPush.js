import getPreviousRoute from '@virtuous/conductor-helpers/getPreviousRoute';
import { ACTION_PUSH } from '@virtuous/conductor/constants';
import getRouteById from '@virtuous/conductor-helpers/getRouteById';
import * as actions from '../../action-creators/router';

/**
 * @param {string} id A route id.
 * @return {Function} The dispatched action.
 */
export default function routeWillEnter(id) {
  return (dispatch) => {
    const route = getRouteById(id);
    const prevRoute = getPreviousRoute();

    if (prevRoute) {
      dispatch(actions.routeWillLeave(prevRoute, ACTION_PUSH));
    }

    dispatch(actions.routeWillEnter(route, ACTION_PUSH));
  };
}
