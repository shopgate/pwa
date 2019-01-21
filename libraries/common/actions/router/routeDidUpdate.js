import { ACTION_UPDATE } from '@virtuous/conductor';
import * as actions from '../../action-creators/router';

/**
 * @param {Route} updated The updated route.
 * @returns {Function}
 */
export function routeDidUpdate(updated) {
  return (dispatch) => {
    dispatch(actions.routeDidUpdate(updated, ACTION_UPDATE));
  };
}
