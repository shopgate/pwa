import { errorManager, ETIMEOUT } from '@shopgate/pwa-core';
import authRoutes from '@shopgate/pwa-common/collections/AuthRoutes';
import redirects from '@shopgate/pwa-common/collections/Redirects';
import { productImageFormats } from '@shopgate/pwa-common-commerce/product/collections';
import { appWillStart$ } from '@shopgate/pwa-common/streams/app';
import {
  CHECKOUT_PATH,
  LOGIN_PATH,
  ORDERS_PATH,
} from '@shopgate/pwa-common/constants/RoutePaths';
import { LEGACY_URL as ORDERS_LEGACY_PATH } from '@shopgate/pwa-common-commerce/orders/constants';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants';
import {
  PRODUCT_SLIDER_IMAGE_COLLECTION_KEY,
  PRODUCT_SLIDER_IMAGE_FORMATS,
} from './Product/constants';
import {
  GALLERY_SLIDER_IMAGE_COLLECTION_KEY,
  GALLERY_SLIDER_IMAGE_FORMATS,
} from './ProductGallery/constants';

/**
 * App subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function app(subscribe) {
  subscribe(appWillStart$, () => {
    authRoutes.set(CHECKOUT_PATH, LOGIN_PATH);
    authRoutes.set(ORDERS_PATH, LOGIN_PATH);
    authRoutes.set(`${ITEM_PATH}/:productId/write_review`, LOGIN_PATH);

    redirects.set(ORDERS_PATH, ORDERS_LEGACY_PATH);

    productImageFormats.set(PRODUCT_SLIDER_IMAGE_COLLECTION_KEY, PRODUCT_SLIDER_IMAGE_FORMATS);
    productImageFormats.set(GALLERY_SLIDER_IMAGE_COLLECTION_KEY, GALLERY_SLIDER_IMAGE_FORMATS);

    // Hide technical details from the user (will be visible in the dev view)
    errorManager.setMessage({
      code: ETIMEOUT, // Should also be done for EUNKNOWN and EINTERNAL in the future.
      message: 'modal.body_error',
    });
  });
}
