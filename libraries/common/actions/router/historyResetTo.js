import { HISTORY_RESET_TO } from '../../constants/ActionTypes';
import { navigate } from '../../action-creators/router';
import { mutable } from '../../helpers/redux';

/**
 * @mixes {MutableFunction}
 * @param {Object} pathname The pathname to reset to
 * @return {Function} The dispatched action.
 */
export const historyResetTo = mutable(pathname => (dispatch) => {
  dispatch(navigate({
    pathname,
    action: HISTORY_RESET_TO,
  }));
});
