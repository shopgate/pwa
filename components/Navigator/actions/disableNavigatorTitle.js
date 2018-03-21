import { disableTitle } from '../action-creators';
import { isTitleShowing } from '../selectors';

/**
 * Disables the Navigator's title.
 * @return {Function} A redux thunk.
 */
const disableNavigatorTitle = () => (dispatch, getState) => {
  if (isTitleShowing(getState())) {
    dispatch(disableTitle());
  }
};

export default disableNavigatorTitle;
