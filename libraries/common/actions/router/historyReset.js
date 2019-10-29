import { ACTION_RESET } from '@virtuous/conductor';
import { navigate } from '../../action-creators/router';
import { mutable } from '../../helpers/redux';

/**
 * @mixes {MutableFunction}
 * @return {Function} The dispatched action.
 */
export const historyReset = mutable(() => (dispatch) => {
  dispatch(navigate({ action: ACTION_RESET }));
});
