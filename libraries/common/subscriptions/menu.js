import { hasNewServices } from '@shopgate/engage/core/helpers';
import { appDidStart$ } from '../streams';
import fetchMenu from '../actions/menu/fetchMenu';
import { QUICKLINKS_MENU, LEGAL_MENU } from '../constants/MenuIDs';

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

    // The "Legal Menu" is maintained inside the Next Admin and not available when running with
    // old services
    if (hasNewServices()) {
      dispatch(fetchMenu(LEGAL_MENU));
    }
  });
}
