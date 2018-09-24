import { setSearchPhrase } from '../action-creators';
import { getSearchPhrase } from '../selectors';

/**
 * Sets the search phrase.
 * @param {string} phrase The new search phrase.
 * @return {Function} A redux thunk.
 */
const setNavigatorSearchPhrase = phrase => (dispatch, getState) => {
  if (getSearchPhrase(getState()) !== phrase) {
    dispatch(setSearchPhrase(phrase));
  }
};

export default setNavigatorSearchPhrase;
