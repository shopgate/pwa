import {
  galleryWillEnter$,
  galleryWillLeave$,
} from '@shopgate/pwa-common-commerce/product/streams';
import disableNavigator from 'Components/Navigator/actions/disableNavigator';
import enableNavigator from 'Components/Navigator/actions/enableNavigator';

/**
 * Product gallery subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function gallery(subscribe) {
  subscribe(galleryWillEnter$, ({ dispatch }) => {
    dispatch(disableNavigator());
  });

  subscribe(galleryWillLeave$, ({ dispatch }) => {
    dispatch(enableNavigator());
  });
}
