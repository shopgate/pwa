import { getCurrentRoute } from '@shopgate/pwa-common/helpers/router';
import { ACTION_POP } from '@virtuous/conductor/constants';
import * as actions from '../../action-creators/router';
import { getCurrentRoute as getCurrentRouteSelector } from '../../selectors/router';

/**
 * @return {Function} The dispatched action.
 */
export function routeWillPop() {
  return (dispatch, getState) => {
    const incoming = getCurrentRoute();
    const outgoing = getCurrentRouteSelector(getState());

    dispatch(actions.routeWillLeave(outgoing, ACTION_POP));
    dispatch(actions.routeWillEnter(incoming, ACTION_POP));
  };
}
