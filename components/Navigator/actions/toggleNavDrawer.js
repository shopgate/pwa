import { toggleNavDrawer as toggleNavDrawerAction } from '../action-creators';
import { isNavDrawerActive } from '../selectors';

/**
 * Toggles the visibility of the navigation drawer.
 * @param {boolean} enabled Whether to show the navigation drawer.
 * @return {Function} A redux thunk.
 */
const toggleNavDrawer = enabled => (dispatch, getState) => {
  if (isNavDrawerActive(getState()) !== enabled) {
    dispatch(toggleNavDrawerAction(enabled));
  }
};

export default toggleNavDrawer;
