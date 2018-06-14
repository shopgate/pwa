import getCurrentRoute from '@virtuous/conductor-helpers/getCurrentRoute';
import * as actions from '../../action-creators/router';
import { getCurrentRoute as getCurrentRouteSelector } from '../../selectors/router';

/**
 * @return {Function} The dispatched action.
 */
const routeDidReplace = () => (dispatch, getState) => {
  const incoming = getCurrentRoute();
  const outgoing = getCurrentRouteSelector(getState());

  dispatch(actions.routeDidLeave(outgoing));
  dispatch(actions.routeDidEnter(incoming));
};

export default routeDidReplace;
