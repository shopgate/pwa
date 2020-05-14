import { cartRequesting$ } from '@shopgate/pwa-common-commerce/cart';
import {
  SHOP_SETTING_CART_SUPPLEMENTAL_CONTENT,
  SHOP_SETTING_ORDER_SUPPLEMENTAL_CONTENT,
} from '../constants';
import { fetchShopSettings } from '../actions';

/**
 * The Engage core subscriptions
 * @param {Function} subscribe Subscribes to an observable.
 */
export default function core(subscribe) {
  subscribe(cartRequesting$, ({ dispatch }) => {
    dispatch(fetchShopSettings([
      SHOP_SETTING_CART_SUPPLEMENTAL_CONTENT,
      SHOP_SETTING_ORDER_SUPPLEMENTAL_CONTENT,
    ]));
  });
}
