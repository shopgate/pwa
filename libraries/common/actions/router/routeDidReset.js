import { getCurrentRoute } from '@shopgate/pwa-common/helpers/router';
import { ACTION_RESET } from '@virtuous/conductor/constants';
import * as actions from '../../action-creators/router';
import { getCurrentRoute as getCurrentRouteSelector } from '../../selectors/router';

/**
 * @return {Function} The dispatched action.
 */
export function routeDidReset() {
  return (dispatch, getState) => {
    const incoming = getCurrentRoute();
    const outgoing = getCurrentRouteSelector(getState());

    dispatch(actions.routeDidLeave(outgoing, ACTION_RESET));
    dispatch(actions.routeDidEnter(incoming, ACTION_RESET));
  };
}
