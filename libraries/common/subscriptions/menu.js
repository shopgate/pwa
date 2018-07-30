import { appDidStart$ } from '../streams';
import fetchMenu from '../actions/menu/fetchMenu';
import { QUICKLINKS_MENU } from '../constants/MenuIDs';

/**
 * Menu subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function menu(subscribe) {
  /**
   * Gets triggered when the app starts.
   */
  subscribe(appDidStart$, ({ dispatch }) => {
    dispatch(fetchMenu(QUICKLINKS_MENU));
  });
}
