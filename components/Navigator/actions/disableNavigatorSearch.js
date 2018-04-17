import { disableSearch } from '../action-creators';
import { isSearchShowing } from '../selectors';

/**
 * Disables the Navigator's search.
 * @return {Function} A redux thunk.
 */
const disableNavigatorSearch = () => (dispatch, getState) => {
  if (isSearchShowing(getState())) {
    dispatch(disableSearch());
  }
};

export default disableNavigatorSearch;
