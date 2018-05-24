import getPreviousRoute from '@virtuous/conductor-helpers/getPreviousRoute';
import getRouteById from '@virtuous/conductor-helpers/getRouteById';
import * as actions from '../../action-creators/router';

/**
 * @param {string} id A route id.
 * @return {Function} The dispatched action.
 */
const routeWillEnter = id => (dispatch) => {
  const route = getRouteById(id);
  const prevRoute = getPreviousRoute();

  if (prevRoute) {
    dispatch(actions.routeWillLeave(prevRoute));
  }

  dispatch(actions.routeWillEnter(route));
};

export default routeWillEnter;
