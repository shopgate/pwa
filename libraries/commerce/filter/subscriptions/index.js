import getFilters from '../actions/getFilters';
import { filterDidEnter$ } from '../streams';

/**
 * Filters subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function filters(subscribe) {
  // On enter fetch the filters
  subscribe(filterDidEnter$, ({ dispatch }) => {
    dispatch(getFilters());
  });
}
