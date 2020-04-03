import { onWillPop } from '@virtuous/conductor';
import { registerEvents, APP_EVENT_APPLICATION_WILL_ENTER_FOREGROUND } from '@shopgate/pwa-core';
import authRoutes from '@shopgate/pwa-common/collections/AuthRoutes';
import redirects from '@shopgate/pwa-common/collections/Redirects';
import { appWillStart$ } from '@shopgate/pwa-common/streams/app';
import { LoadingProvider } from '@shopgate/pwa-common/providers';
import { getCurrentPathname } from '@shopgate/pwa-common/selectors/router';
import { hasScannerSupport } from '@shopgate/pwa-common/selectors/client';
import {
  CHECKOUT_PATH,
  LOGIN_PATH,
  ORDERS_PATH,
} from '@shopgate/pwa-common/constants/RoutePaths';
import { LEGACY_URL as ORDERS_LEGACY_PATH } from '@shopgate/pwa-common-commerce/orders/constants';
import {
  ITEM_PATH,
  productImageFormats,
  enableRedirectHandler,
  setDefaultProductFetchParams,
} from '@shopgate/engage/product';
import { grantCameraPermissions, getThemeSettings } from '@shopgate/engage/core';
import { SCANNER_PATH } from '@shopgate/pwa-common-commerce/scanner/constants';
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

    // set formats for product images
    let { HeroImage: pdpResolutions, GalleryImage: galleryResolutions } = getThemeSettings('AppImages') || {};

    if (!(pdpResolutions && pdpResolutions.length)) {
      pdpResolutions = PRODUCT_SLIDER_IMAGE_FORMATS;
    }

    if (!(galleryResolutions && galleryResolutions.length)) {
      galleryResolutions = GALLERY_SLIDER_IMAGE_FORMATS;
    }

    productImageFormats.set(PRODUCT_SLIDER_IMAGE_COLLECTION_KEY, pdpResolutions);
    productImageFormats.set(GALLERY_SLIDER_IMAGE_COLLECTION_KEY, galleryResolutions);

    onWillPop(NavDrawer.close);

    /**
     * This feature is currently in BETA testing.
     * It should only be used for approved BETA Client Projects
     */
    enableRedirectHandler();

    /**
     * This feature is currently in BETA testing.
     * It should only be used for approved BETA Client Projects
     */
    setDefaultProductFetchParams();
  });
}
