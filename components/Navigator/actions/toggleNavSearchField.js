import { toggleSearch } from '../action-creators';
import { isNavSearchFieldActive } from '../selectors';

/**
 * Toggles the visibility of the navigation drawer.
 * @param {boolean} value Whether to show the navigation search field.
 * @return {Function} A redux thunk.
 */
const toggleNavSearchField = value => (dispatch, getState) => {
  if (isNavSearchFieldActive(getState()) !== value) {
    dispatch(toggleSearch(value));
  }
};

export default toggleNavSearchField;
