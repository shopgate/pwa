import {
  galleryWillEnter$,
  galleryWillLeave$,
} from '@shopgate/pwa-common-commerce/product/streams';
import { toggleNavigator } from 'Components/Navigator/action-creators/';

/**
 * Product gallery subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function gallery(subscribe) {
  subscribe(galleryWillEnter$, ({ dispatch }) => {
    dispatch(toggleNavigator(false));
  });

  subscribe(galleryWillLeave$, ({ dispatch }) => {
    dispatch(toggleNavigator(true));
  });
}
