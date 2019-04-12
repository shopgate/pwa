import { onWillPop } from '@virtuous/conductor';
import {
  errorManager,
  registerEvents,
  ETIMEOUT,
  APP_EVENT_APPLICATION_WILL_ENTER_FOREGROUND,
} from '@shopgate/pwa-core';
import authRoutes from '@shopgate/pwa-common/collections/AuthRoutes';
import redirects from '@shopgate/pwa-common/collections/Redirects';
import { appWillStart$ } from '@shopgate/pwa-common/streams/app';
import { LoadingProvider } from '@shopgate/pwa-common/providers';
import { getCurrentPathname } from '@shopgate/pwa-common/selectors/router';
import {
  CHECKOUT_PATH,
  LOGIN_PATH,
  ORDERS_PATH,
} from '@shopgate/pwa-common/constants/RoutePaths';
import { LEGACY_URL as ORDERS_LEGACY_PATH } from '@shopgate/pwa-common-commerce/orders/constants';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants';
import { SCANNER_PATH } from '@shopgate/pwa-common-commerce/scanner/constants';
import grantCameraPermissions from '@shopgate/pwa-common-commerce/scanner/actions/grantCameraPermissions';
import { productImageFormats } from '@shopgate/pwa-common-commerce/product/collections';
import { NavDrawer } from '@shopgate/pwa-ui-material';
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
  subscribe(appWillStart$, ({ dispatch, getState }) => {
    registerEvents([APP_EVENT_APPLICATION_WILL_ENTER_FOREGROUND]);

    authRoutes.set(CHECKOUT_PATH, LOGIN_PATH);
    authRoutes.set(ORDERS_PATH, LOGIN_PATH);
    authRoutes.set(`${ITEM_PATH}/:productId/write_review`, LOGIN_PATH);

    redirects.set(ORDERS_PATH, ORDERS_LEGACY_PATH);

    // Protect the scanner path with a camera permissions check.
    redirects.set(SCANNER_PATH, ({ action }) => new Promise((resolve) => {
      const { params: { pathname } } = action;
      LoadingProvider.unsetLoading(getCurrentPathname(getState()));
      dispatch(grantCameraPermissions())
        .then((granted) => {
          resolve(granted ? pathname : null);
        });
    }));

    // set formats for product images
    productImageFormats.set(PRODUCT_SLIDER_IMAGE_COLLECTION_KEY, PRODUCT_SLIDER_IMAGE_FORMATS);
    productImageFormats.set(GALLERY_SLIDER_IMAGE_COLLECTION_KEY, GALLERY_SLIDER_IMAGE_FORMATS);

    onWillPop(NavDrawer.close);

    // Hide technical details from the user (will be visible in the dev view)
    errorManager.setMessage({
      code: ETIMEOUT, // Should also be done for EUNKNOWN and EINTERNAL in the future.
      message: 'modal.body_error',
    });
  });
}
