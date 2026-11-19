import { ACTION_POP } from '@virtuous/conductor';
import * as actions from '../../action-creators/router';

/** @import { Route } from '@virtuous/conductor' */

/**
 * @param {Route} prev The previous route.
 * @param {Route} next The next route.
 * @returns {Function}
 */
export function routeDidPop(prev, next) {
  return (dispatch) => {
    dispatch(actions.routeDidLeave(prev, ACTION_POP));
    dispatch(actions.routeDidEnter(next, ACTION_POP));
  };
}
