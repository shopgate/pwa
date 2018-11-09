import { ACTION_POP } from '@virtuous/conductor';
import * as actions from '../../action-creators/router';

/**
 * @param {Route} prev The previous route.
 * @param {Route} next The next route.
 * @returns {Function}
 */
export function routeWillPop(prev, next) {
  return (dispatch) => {
    dispatch(actions.routeWillLeave(prev, ACTION_POP));
    dispatch(actions.routeWillEnter(next, ACTION_POP));
  };
}
