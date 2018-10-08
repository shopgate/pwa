import setTitle from '@shopgate/pwa-common/actions/view/setTitle';
import { ACTION_PUSH } from '@virtuous/conductor/constants';
import { filterWillEnter$, filterableRoutesWillReenter$ } from '@shopgate/pwa-common-commerce/filter/streams';
import { toggleNavigatorSearch } from 'Components/Navigator/action-creators';

/**
 * @param {Function} subscribe Subscribes to streams.
 */
export default function filter(subscribe) {
  subscribe(filterWillEnter$, ({ dispatch, action }) => {
    dispatch(setTitle('titles.filter'));

    if (action.historyAction === ACTION_PUSH) {
      dispatch(toggleNavigatorSearch(false));
    }
  });

  subscribe(filterableRoutesWillReenter$, ({ dispatch }) => {
    dispatch(toggleNavigatorSearch(true));
  });
}
