import { enableTitle } from '../action-creators';
import { isTitleShowing } from '../selectors';

/**
 * Enables the Navigator's title.
 * @return {Function} A redux thunk.
 */
const enableNavigatorTitle = () => (dispatch, getState) => {
  if (!isTitleShowing(getState())) {
    dispatch(enableTitle());
  }
};

export default enableNavigatorTitle;
