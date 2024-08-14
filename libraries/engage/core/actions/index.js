export { default as getGeolocation } from './getGeolocation';
export { default as grantCameraPermissions } from './grantCameraPermissions';
export { default as grantGeolocationPermissions } from './grantGeolocationPermissions';
export { default as grantPushPermissions } from './grantPushPermissions';
export { default as grantAppTrackingTransparencyPermission } from './grantAppTrackingTransparencyPermission';
export { default as requestAppPermission } from './requestAppPermission';
export { default as requestAppPermissionStatus } from './requestAppPermissionStatus';
export { default as updateStatusBarBackground } from './updateStatusBarBackground';

export { default as grantPermissions } from './grantPermissions';

// --------------- APP --------------- //
export { default as handleDeepLink } from '@shopgate/pwa-common/actions/app/handleDeepLink';
export { default as handleUniversalLink } from '@shopgate/pwa-common/actions/app/handleUniversalLink';
export { default as handleLink } from '@shopgate/pwa-common/actions/app/handleLink';
export { default as handlePushNotification } from '@shopgate/pwa-common/actions/app/handlePushNotification';
export { default as registerLinkEvents } from '@shopgate/pwa-common/actions/app/registerLinkEvents';

// --------------- CLIENT --------------- //
export { default as fetchClientInformation } from '@shopgate/pwa-common/actions/client/fetchClientInformation';

// --------------- ROUTER --------------- //
export { historyPop } from '@shopgate/pwa-common/actions/router/historyPop';
export { historyPush } from '@shopgate/pwa-common/actions/router/historyPush';
export { historyRedirect } from '@shopgate/pwa-common/actions/router/historyRedirect';
export { historyReplace } from '@shopgate/pwa-common/actions/router/historyReplace';
export { historyReset } from '@shopgate/pwa-common/actions/router/historyReset';

// --------------- URL --------------- //
export { resetApp } from '@shopgate/pwa-common/action-creators/app';
export * from '@shopgate/pwa-common/action-creators/url';

// --------------- MENU --------------- //
export { default as fetchMenu } from '@shopgate/pwa-common/actions/menu/fetchMenu';

// --------------- MODAL --------------- //
export { default as closeModal } from '@shopgate/pwa-common/actions/modal/closeModal';
export { default as promiseMap } from '@shopgate/pwa-common/actions/modal/promiseMap';
export { default as showModal } from '@shopgate/pwa-common/actions/modal/showModal';
