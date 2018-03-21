import { enableSearch } from '../action-creators';
import { isSearchShowing } from '../selectors';

/**
 * Enables the Navigator's search.
 * @return {Function} A redux thunk.
 */
const enableNavigatorSearch = () => (dispatch, getState) => {
  if (!isSearchShowing(getState())) {
    dispatch(enableSearch());
  }
};

export default enableNavigatorSearch;
