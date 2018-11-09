import { ACTION_REPLACE } from '@virtuous/conductor';
import * as actions from '../../action-creators/router';

/**
 * @param {Route} prev The previous route.
 * @param {Route} next The next route.
 * @returns {Function}
 */
export function routeDidReplace(prev, next) {
  return (dispatch) => {
    dispatch(actions.routeDidLeave(prev, ACTION_REPLACE));
    dispatch(actions.routeDidEnter(next, ACTION_REPLACE));
  };
}
