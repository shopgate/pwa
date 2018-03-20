import { disable } from '../action-creators';
import { isEnabled } from '../selectors';

/**
 * Disables the navigator.
 * @return {Function} A redux thunk.
 */
const disableNavigator = () => (dispatch, getState) => {
  if (isEnabled(getState())) {
    dispatch(disable());
  }
};

export default disableNavigator;
