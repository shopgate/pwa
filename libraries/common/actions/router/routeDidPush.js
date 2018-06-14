import getPreviousRoute from '@virtuous/conductor-helpers/getPreviousRoute';
import getRouteById from '@virtuous/conductor-helpers/getRouteById';
import * as actions from '../../action-creators/router';

/**
 * @param {string} id A route id.
 * @return {Function} The dispatched action.
 */
const routeDidEnter = id => (dispatch) => {
  const route = getRouteById(id);
  const prevRoute = getPreviousRoute();

  if (prevRoute) {
    dispatch(actions.routeDidLeave(prevRoute));
  }

  dispatch(actions.routeDidEnter(route));
};

export default routeDidEnter;
