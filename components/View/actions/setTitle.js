import setViewTitle from '../action-creators/setViewTitle';
import { getTitle } from '../selectors';

/**
 * Sets the title of the Navigator.
 * @param {string} title The title text for the navigator.
 * @return {Function} A redux thunk.
 */
const setTitle = title => (dispatch, getState) => {
  if (getTitle(getState()) !== title) {
    dispatch(setViewTitle(title));
  }
};

export default setTitle;
