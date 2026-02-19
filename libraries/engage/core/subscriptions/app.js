import { appWillStart$ } from '@shopgate/engage/core/streams';
import { configuration, redirects } from '@shopgate/engage/core/collections';
import {
  hasNewServices,
  appSupportsAndroidEdgeToEdge,
  updateAndroidNavigationBarColor,
} from '@shopgate/engage/core/helpers';
import { CONFIGURATION_COLLECTION_KEY_BASE_URL } from '@shopgate/engage/core/constants';
import { appConfig } from '@shopgate/engage';
import { reloadApp$ } from '../streams';
import { reloadApp } from '../action-creators';
import {
  PERMISSION_REQUEST_ROUTE_LOCATION,
  PERMISSION_REQUEST_ROUTE_LOCATION_BACKGROUND,
  PERMISSION_REQUEST_ROUTE_PUSH,
  PERMISSION_REQUEST_ROUTE_TRACKING,
  PERMISSION_REQUEST_ROUTE_CAMERA,
} from '../constants';

import { permissionRouteRedirectHandler } from '../router/permissionRouteRedirectHandler';

const { androidNavigationBarDefaultColor } = appConfig;
/**
 * App subscriptions
 * @param {Function} subscribe The subscribe function
 */
export default function app(subscribe) {
  subscribe(appWillStart$, ({ dispatch }) => {
    console.log(`%cℹ️ PWA uses ${hasNewServices() ? 'NEW' : 'OLD'} services`, 'color: blue');

    // Add global function to enable PWA reload from the console
    window.reloadSGApp = () => {
      dispatch(reloadApp());
    };

    if (appSupportsAndroidEdgeToEdge() && androidNavigationBarDefaultColor) {
      // Set the navigation bar color for android devices with edge-to-edge screens
      updateAndroidNavigationBarColor({ color: androidNavigationBarDefaultColor });
    }

    // Register redirects for app permission request routes
    redirects.set(
      PERMISSION_REQUEST_ROUTE_LOCATION,
      permissionRouteRedirectHandler,
      { showLoading: false }
    );
    redirects.set(
      PERMISSION_REQUEST_ROUTE_LOCATION_BACKGROUND,
      permissionRouteRedirectHandler,
      { showLoading: false }
    );
    redirects.set(
      PERMISSION_REQUEST_ROUTE_PUSH,
      permissionRouteRedirectHandler,
      { showLoading: false }
    );
    redirects.set(
      PERMISSION_REQUEST_ROUTE_TRACKING,
      permissionRouteRedirectHandler,
      { showLoading: false }
    );
    redirects.set(
      PERMISSION_REQUEST_ROUTE_CAMERA,
      permissionRouteRedirectHandler,
      { showLoading: false }
    );
    redirects.set(
      PERMISSION_REQUEST_ROUTE_CAMERA,
      permissionRouteRedirectHandler,
      { showLoading: false }
    );
  });

  subscribe(reloadApp$, () => {
    // A deployed app can only be reloaded on the base url. So we first set this as current route
    // before the reload happens.
    window.history.replaceState({}, null, configuration.get(CONFIGURATION_COLLECTION_KEY_BASE_URL));
    window.location.reload();
  });
}
