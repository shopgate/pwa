import setViewTitle from '../../action-creators/view/setViewTitle';
import { getTitle } from '../../selectors/ui';

/**
 * Sets the title of the Navigator.
 * @param {string} title The title text for the navigator.
 * @return {Function} A redux thunk.
 */
export default function setTitle(title) {
  return (dispatch, getState) => {
    if (getTitle(getState()) !== title) {
      dispatch(setViewTitle(title));
    }
  };
}
