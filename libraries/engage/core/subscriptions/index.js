import { cartRequesting$ } from '@shopgate/pwa-common-commerce/cart';
import { configuration } from '@shopgate/pwa-common/collections';
import { IS_CONNECT_EXTENSION_ATTACHED } from '@shopgate/pwa-common/constants/Configuration';
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
    if (!configuration.get(IS_CONNECT_EXTENSION_ATTACHED)) {
      return;
    }

    dispatch(fetchShopSettings([
      SHOP_SETTING_CART_SUPPLEMENTAL_CONTENT,
      SHOP_SETTING_ORDER_SUPPLEMENTAL_CONTENT,
    ]));
  });
}
