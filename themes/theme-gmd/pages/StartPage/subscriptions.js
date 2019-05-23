import { PAGE_ID_INDEX, fetchPageConfig } from '@shopgate/engage/page';
import { startPageWillEnter$ } from './streams';

/**
 * Page subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function page(subscribe) {
  subscribe(startPageWillEnter$, ({ dispatch }) => {
    dispatch(fetchPageConfig(PAGE_ID_INDEX));
  });
}
