import {
  errorManager,
  registerEvents,
  ETIMEOUT,
  APP_EVENT_APPLICATION_WILL_ENTER_FOREGROUND,
} from '@shopgate/engage/core';
import authRoutes from '@shopgate/pwa-common/collections/AuthRoutes';
import redirects from '@shopgate/pwa-common/collections/Redirects';
import { LoadingProvider } from '@shopgate/engage/core';
import { getCurrentPathname } from '@shopgate/engage/core';
import { hasScannerSupport } from '@shopgate/engage/core';
import { productImageFormats } from '@shopgate/engage/product';
import { appWillStart$ } from '@shopgate/engage/core';
import {
  CHECKOUT_PATH,
  LOGIN_PATH,
  ORDERS_PATH,
} from '@shopgate/engage/checkout';
import { LEGACY_URL as ORDERS_LEGACY_PATH } from '@shopgate/pwa-common-commerce/orders/constants';
import { ITEM_PATH } from '@shopgate/engage/product';
import { SCANNER_PATH } from '@shopgate/engage/scanner';
import grantCameraPermissions from '@shopgate/pwa-common-commerce/scanner/actions/grantCameraPermissions';
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
      LoadingProvider.unsetLoading(getCurrentPathname(getState()));
      const hasSupport = hasScannerSupport(getState());

      if (!hasSupport) {
        return resolve(null);
      }

      const { params: { pathname } } = action;

      dispatch(grantCameraPermissions())
        .then((granted) => {
          resolve(granted ? pathname : null);
        });

      return true;
    }));

    productImageFormats.set(PRODUCT_SLIDER_IMAGE_COLLECTION_KEY, PRODUCT_SLIDER_IMAGE_FORMATS);
    productImageFormats.set(GALLERY_SLIDER_IMAGE_COLLECTION_KEY, GALLERY_SLIDER_IMAGE_FORMATS);

    // Hide technical details from the user (will be visible in the dev view)
    errorManager.setMessage({
      code: ETIMEOUT, // Should also be done for EUNKNOWN and EINTERNAL in the future.
      message: 'modal.body_error',
    });
  });
}
