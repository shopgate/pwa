import toggleCartIcon from 'Components/Navigator/actions/toggleCartIcon';
import disableNavigatorSearch from 'Components/Navigator/actions/disableNavigatorSearch';
import { cartWillEnter$ } from '@shopgate/pwa-common-commerce/cart/streams';
import setTitle from '../../components/View/actions/setTitle';

/**
 * Cart subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function cart(subscribe) {
  subscribe(cartWillEnter$, ({ dispatch }) => {
    dispatch(setTitle('titles.cart'));
    dispatch(toggleCartIcon(false));
    dispatch(disableNavigatorSearch());
  });
}
