import { setBackgroundColor } from '../action-creators';
import { getBackgroundColor } from '../selectors';

/**
 * Sets the color of the Navigator's background.
 * @param {string} color The new background color of the navigator.
 * @return {Function} A redux thunk.
 */
const setNavigatorBackground = color => (dispatch, getState) => {
  if (getBackgroundColor(getState()) !== color) {
    dispatch(setBackgroundColor(color));
  }
};

export default setNavigatorBackground;
