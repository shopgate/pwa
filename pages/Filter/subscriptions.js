import setTitle from '@shopgate/pwa-common/actions/view/setTitle';
import { filterWillEnter$, filterWillLeave$ } from '@shopgate/pwa-common-commerce/filter/streams';
import { setFilterOpened, setFilterClosed } from 'Components/Navigator/action-creators';

/**
 * @param {Function} subscribe Subscribes to streams.
 */
export default function filter(subscribe) {
  subscribe(filterWillEnter$, ({ dispatch }) => {
    dispatch(setTitle('titles.filter'));
    dispatch(setFilterOpened());
  });

  subscribe(filterWillLeave$, ({ dispatch }) => {
    dispatch(setFilterClosed());
  });
}
