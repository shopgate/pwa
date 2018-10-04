import { setTextColor } from '../action-creators';
import { getTextColor } from '../selectors';

/**
 * Sets the color of the Navigator's text.
 * @param {string} color The new text color of the navigator.
 * @return {Function} A redux thunk.
 */
const setNavigatorColor = color => (dispatch, getState) => {
  if (getTextColor(getState()) !== color) {
    dispatch(setTextColor(color));
  }
};

export default setNavigatorColor;
