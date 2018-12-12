import { ACTION_PUSH } from '@virtuous/conductor';
import * as actions from '../../action-creators/router';

/**
 * @param {Route} prev The previous route.
 * @param {Route} next The next route.
 * @returns {Function}
 */
export function routeDidPush(prev, next) {
  return (dispatch) => {
    if (prev) {
      dispatch(actions.routeDidLeave(prev, ACTION_PUSH));
    }

    dispatch(actions.routeDidEnter(next, ACTION_PUSH));
  };
}
