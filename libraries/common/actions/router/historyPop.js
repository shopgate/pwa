import { ACTION_POP } from '@virtuous/conductor/constants';
import { navigate } from '../../action-creators/router';

/**
 * @param {?Object} params The history params.
 * @return {Function} The dispatched action.
 */
export function historyPop(params = {}) {
  return (dispatch) => {
    dispatch(navigate({
      ...params,
      action: ACTION_POP,
    }));
  };
}
