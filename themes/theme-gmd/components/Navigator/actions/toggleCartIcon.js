import { isCartButtonVisible } from '../selectors';
import { toggleCartIcon as toggleNavigatorCartIcon } from '../action-creators';

/**
 * Toggles the visibility of the cart icon.
 * @param {boolean} value Whether to show the cart icon.
 * @return {Function} A redux thunk.
 */
const toggleCartIcon = value => (dispatch, getState) => {
  if (isCartButtonVisible(getState()) !== value) {
    dispatch(toggleNavigatorCartIcon(value));
  }
};

export default toggleCartIcon;
