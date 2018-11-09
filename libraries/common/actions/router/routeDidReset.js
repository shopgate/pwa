import { ACTION_RESET } from '@virtuous/conductor';
import * as actions from '../../action-creators/router';

/**
 * @param {Route} prev The previous route.
 * @param {Route} next The next route.
 * @returns {Function}
 */
export function routeDidReset(prev, next) {
  return (dispatch) => {
    dispatch(actions.routeDidLeave(prev, ACTION_RESET));
    dispatch(actions.routeDidEnter(next, ACTION_RESET));
  };
}
