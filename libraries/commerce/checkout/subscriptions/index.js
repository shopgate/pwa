import 'rxjs/add/operator/debounceTime';
import event from '@shopgate/pwa-core/classes/Event';
import registerEvents from '@shopgate/pwa-core/commands/registerEvents';
import { appDidStart$ } from '@shopgate/pwa-common/streams/app';
import successCheckout from '../action-creators/successCheckout';
import expireProductsById from '../../product/action-creators/expireProductsById';
import { checkoutSucceeded$ } from '../streams';
import { getCartProducts } from '../../cart/selectors';

/**
 * Checkout subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
const checkout = (subscribe) => {
  /**
   * Gets triggered when the app starts.
   */
  subscribe(appDidStart$, ({ dispatch, getState }) => {
    // Register for the app event that is triggered when the checkout process is finished
    registerEvents(['checkoutSuccess']);

    event.addCallback('checkoutSuccess', () => {
      dispatch(successCheckout(getCartProducts(getState())));
    });
  });

  /**
   * First thing to be triggered when a checkout is successful.
   */
  subscribe(checkoutSucceeded$, ({ dispatch, getState }) => {
    dispatch(expireProductsById(getCartProducts(getState())
      .map(cartProduct => (cartProduct.product.id))));
  });
};

export default checkout;
