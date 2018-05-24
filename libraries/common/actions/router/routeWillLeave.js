import getCurrentRoute from '@virtuous/conductor-helpers/getCurrentRoute';
import * as actions from '../../action-creators/router';

/**
 * @return {Function} The dispatched action.
 */
const routeWillLeave = () => (dispatch) => {
  const incomingRoute = getCurrentRoute();

  dispatch(actions.routeWillLeave(null));
  dispatch(actions.routeWillEnter(incomingRoute));
};

export default routeWillLeave;
