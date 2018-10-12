import { onWillPop } from '@virtuous/conductor-events';
import authRoutes from '@shopgate/pwa-common/collections/AuthRoutes';
import redirects from '@shopgate/pwa-common/collections/Redirects';
import { appWillStart$ } from '@shopgate/pwa-common/streams/app';
import {
  CHECKOUT_PATH,
  LOGIN_PATH,
  REGISTER_PATH,
  ORDERS_PATH,
} from '@shopgate/pwa-common/constants/RoutePaths';
import { LEGACY_URL as REGISTER_LEGACY_PATH } from '@shopgate/pwa-common/constants/Registration';
import { LEGACY_URL as CHECKOUT_LEGACY_PATH } from '@shopgate/pwa-common-commerce/checkout/constants';
import { LEGACY_URL as ORDERS_LEGACY_PATH } from '@shopgate/pwa-common-commerce/orders/constants';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants';
import { NavDrawer } from '@shopgate/pwa-ui-material';

/**
 * App subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function app(subscribe) {
  subscribe(appWillStart$, () => {
    authRoutes.set(CHECKOUT_PATH, LOGIN_PATH);
    authRoutes.set(ORDERS_PATH, LOGIN_PATH);
    authRoutes.set(`${ITEM_PATH}/:productId/write_review`, LOGIN_PATH);

    redirects.set(CHECKOUT_PATH, CHECKOUT_LEGACY_PATH);
    redirects.set(REGISTER_PATH, REGISTER_LEGACY_PATH);
    redirects.set(ORDERS_PATH, ORDERS_LEGACY_PATH);

    onWillPop(NavDrawer.close);
  });
}
