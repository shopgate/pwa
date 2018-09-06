import setTitle from '@shopgate/pwa-common/actions/view/setTitle';
import { ACTION_PUSH } from '@virtuous/conductor/constants';
import { filterWillEnter$, filterableRoutesWillReenter$ } from '@shopgate/pwa-common-commerce/filter/streams';
import { setFilterOpened, setFilterClosed } from 'Components/Navigator/action-creators';
import disableNavigatorSearch from 'Components/Navigator/actions/disableNavigatorSearch';
import enableNavigatorSearch from 'Components/Navigator/actions/enableNavigatorSearch';

/**
 * @param {Function} subscribe Subscribes to streams.
 */
export default function filter(subscribe) {
  subscribe(filterWillEnter$, ({ dispatch, action }) => {
    dispatch(setTitle('titles.filter'));

    if (action.historyAction === ACTION_PUSH) {
      dispatch(setFilterOpened());
      dispatch(disableNavigatorSearch());
    }
  });

  subscribe(filterableRoutesWillReenter$, ({ dispatch }) => {
    dispatch(setFilterClosed());
    dispatch(enableNavigatorSearch());
  });
}
