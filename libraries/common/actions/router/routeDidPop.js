import getCurrentRoute from '@virtuous/conductor-helpers/getCurrentRoute';
import { ACTION_POP } from '@virtuous/conductor/constants';
import * as actions from '../../action-creators/router';
import { getCurrentRoute as getCurrentRouteSelector } from '../../selectors/router';

/**
 * @return {Function} The dispatched action.
 */
export default function routeDidLeave() {
  return (dispatch, getState) => {
    const incoming = getCurrentRoute();
    const outgoing = getCurrentRouteSelector(getState());

    dispatch(actions.routeDidLeave(outgoing, ACTION_POP));
    dispatch(actions.routeDidEnter(incoming, ACTION_POP));
  };
}
