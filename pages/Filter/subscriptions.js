import setTitle from '@shopgate/pwa-common/actions/view/setTitle';
import { filterWillEnter$, filterWillLeave$ } from '@shopgate/pwa-common-commerce/filter/streams';
import { setFilterOpened, setFilterClosed } from 'Components/Navigator/action-creators';
import disableNavigatorSearch from 'Components/Navigator/actions/disableNavigatorSearch';
import enableNavigatorSearch from 'Components/Navigator/actions/enableNavigatorSearch';

/**
 * @param {Function} subscribe Subscribes to streams.
 */
export default function filter(subscribe) {
  subscribe(filterWillEnter$, ({ dispatch }) => {
    dispatch(setTitle('titles.filter'));
    dispatch(setFilterOpened());
    dispatch(disableNavigatorSearch());
  });

  subscribe(filterWillLeave$, ({ dispatch }) => {
    dispatch(setFilterClosed());
    dispatch(enableNavigatorSearch());
  });
}
