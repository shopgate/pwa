import { ACTION_REPLACE } from '@virtuous/conductor';
import * as actions from '../../action-creators/router';

/**
 * @param {Route} prev The previous route.
 * @param {Route} next The next route.
 * @returns {Function}
 */
export function routeWillReplace(prev, next) {
  return (dispatch) => {
    dispatch(actions.routeWillLeave(prev, ACTION_REPLACE));
    dispatch(actions.routeWillEnter(next, ACTION_REPLACE));
  };
}
