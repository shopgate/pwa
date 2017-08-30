import { getSearchPhrase } from '@shopgate/pwa-common/selectors/history';
import { setSearchPhrase as setPhrase } from 'Components/Navigator/action-creators';

/**
 * Removes the last entry from the active filters stack.
 * @returns {Function} A redux thunk.
 */
const setSearchPhrase = query => (dispatch, getState) => {
  const searchPhrase = getSearchPhrase(getState()) || '';

  if (query === searchPhrase) {
    return;
  }

  dispatch(setPhrase(query));
};

export default setSearchPhrase;
