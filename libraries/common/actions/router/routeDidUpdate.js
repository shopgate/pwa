import { ACTION_UPDATE, getRouteById } from '@shopgate/pwa-common/helpers/router';
import * as actions from '../../action-creators/router';

/**
 * @param {string} id A route ID.
 * @returns {Function}
 */
export function routeDidUpdate(id) {
  return (dispatch) => {
    const route = getRouteById(id);
    dispatch(actions.routeDidUpdate(route, ACTION_UPDATE));
  };
}
