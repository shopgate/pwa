import 'rxjs/add/operator/debounceTime';
import event from '@shopgate/pwa-core/classes/Event';
import registerEvents from '@shopgate/pwa-core/commands/registerEvents';
import { appDidStart$ } from '@shopgate/pwa-common/streams/app';
import successCheckout from '../action-creators/successCheckout';
import clearProductsById from '../../product/action-creators/clearProductsById';
import { checkoutSucceeded$ } from '../streams';
import { getCartProducts } from '../../cart/selectors';

/**
 * Cart subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function cart(subscribe) {
  /**
   * Gets triggered when the app starts.
   */
  subscribe(appDidStart$, ({ dispatch }) => {
    // Register for the app event that is triggered when the checkout process is finished
    registerEvents(['checkoutSuccess']);

    event.addCallback('checkoutSuccess', () => {
      dispatch(successCheckout);
    });
  });

  /**
   * First thing to be triggered when a checkout is successful.
   */
  subscribe(checkoutSucceeded$, ({ dispatch, getState }) => {
    dispatch(clearProductsById(getCartProducts(getState())
      .map(cartProduct => (cartProduct.product.id))));
  });
}
