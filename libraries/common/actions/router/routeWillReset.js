import { ACTION_RESET } from '@virtuous/conductor';
import * as actions from '../../action-creators/router';

/**
 * @param {Route} prev The previous route.
 * @param {Route} next The next route.
 * @returns {Function}
 */
export function routeWillReset(prev, next) {
  return (dispatch) => {
    dispatch(actions.routeWillLeave(prev, ACTION_RESET));
    dispatch(actions.routeWillEnter(next, ACTION_RESET));
  };
}
