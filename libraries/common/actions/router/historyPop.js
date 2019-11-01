import { ACTION_POP } from '@virtuous/conductor';
import { navigate } from '../../action-creators/router';
import { mutable } from '../../helpers/redux';

/**
 * @mixes {MutableFunction}
 * @param {Object} [params={}] The history params.
 * @return {Function} The dispatched action.
 */
export const historyPop = mutable((params = {}) => (dispatch) => {
  dispatch(navigate({
    ...params,
    action: ACTION_POP,
  }));
});
