import fetchFilters from '../actions/fetchFilters';
import { filterDidEnter$ } from '../streams';

/**
 * Filters subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function filters(subscribe) {
  subscribe(filterDidEnter$, ({ dispatch }) => {
    dispatch(fetchFilters());
  });
}
