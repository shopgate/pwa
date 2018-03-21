import { enable } from '../action-creators';
import { isEnabled } from '../selectors';

/**
 * Disables the navigator.
 * @return {Function} A redux thunk.
 */
const enableNavigator = () => (dispatch, getState) => {
  if (!isEnabled(getState())) {
    dispatch(enable());
  }
};

export default enableNavigator;
