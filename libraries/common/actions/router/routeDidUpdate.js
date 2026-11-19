import { ACTION_UPDATE } from '@virtuous/conductor';
import * as actions from '../../action-creators/router';

/** @import { Route } from '@virtuous/conductor' */

/**
 * @param {Route} route The updated route.
 * @returns {Function}
 */
export function routeDidUpdate(route) {
  return (dispatch) => {
    dispatch(actions.routeDidUpdate(route, ACTION_UPDATE));
  };
}
