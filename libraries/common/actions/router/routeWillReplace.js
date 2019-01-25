import { ACTION_REPLACE, getCurrentRoute } from '@shopgate/pwa-common/helpers/router';
import * as actions from '../../action-creators/router';
import { getCurrentRoute as getCurrentRouteSelector } from '../../selectors/router';

/**
 * @returns {Function}
 */
export function routeWillReplace() {
  return (dispatch, getState) => {
    const incoming = getCurrentRoute();
    const outgoing = getCurrentRouteSelector(getState());

    dispatch(actions.routeWillLeave(outgoing, ACTION_REPLACE));
    dispatch(actions.routeWillEnter(incoming, ACTION_REPLACE));
  };
}
