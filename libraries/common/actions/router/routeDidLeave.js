import getCurrentRoute from '@virtuous/conductor-helpers/getCurrentRoute';
import * as actions from '../../action-creators/router';

/**
 * @return {Function} The dispatched action.
 */
const routeDidLeave = () => (dispatch) => {
  const currentRoute = getCurrentRoute();

  dispatch(actions.routeDidLeave(null));
  dispatch(actions.routeDidEnter(currentRoute));
};

export default routeDidLeave;
