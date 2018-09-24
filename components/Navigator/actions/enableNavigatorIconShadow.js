import { enableIconShadow } from '../action-creators';
import { isIconShadowShowing } from '../selectors';

/**
 * Enables the shadow on the Navigator's icons.
 * @return {Function} A redux thunk.
 */
const enableNavigatorIconShadow = () => (dispatch, getState) => {
  if (!isIconShadowShowing(getState())) {
    dispatch(enableIconShadow());
  }
};

export default enableNavigatorIconShadow;
