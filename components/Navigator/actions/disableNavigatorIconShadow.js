import { disableIconShadow } from '../action-creators';
import { isIconShadowShowing } from '../selectors';

/**
 * Disables the shadow on the Navigator's icons.
 * @return {Function} A redux thunk.
 */
const disableNavigatorIconShadow = () => (dispatch, getState) => {
  if (isIconShadowShowing(getState())) {
    dispatch(disableIconShadow());
  }
};

export default disableNavigatorIconShadow;
