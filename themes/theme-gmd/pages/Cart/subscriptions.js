import {
  toggleNavigatorCart,
  toggleNavigatorSearch,
} from 'Components/Navigator/action-creators';
import { cartWillEnter$, cartWillLeave$ } from '@shopgate/pwa-common-commerce/cart/streams';
import setTitle from '@shopgate/pwa-common/actions/view/setTitle';

/**
 * Cart subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function cart(subscribe) {
  subscribe(cartWillEnter$, ({ dispatch }) => {
    dispatch(setTitle('titles.cart'));
    dispatch(toggleNavigatorCart(false));
    dispatch(toggleNavigatorSearch(false));
  });

  subscribe(cartWillLeave$, ({ dispatch }) => {
    dispatch(toggleNavigatorCart(true));
    dispatch(toggleNavigatorSearch(true));
  });
}
