/** @module scanner */

// ACTIONS
export { default as grantCameraPermissions } from '@shopgate/pwa-common-commerce/scanner/actions/grantCameraPermissions';
export { default as handleBarCode } from '@shopgate/pwa-common-commerce/scanner/actions/handleBarCode';
export { default as handleQrCode } from '@shopgate/pwa-common-commerce/scanner/actions/handleQrCode';

// CONSTANTS
export * from '@shopgate/pwa-common-commerce/scanner/constants';
export * from '@shopgate/pwa-common-commerce/scanner/constants/Portals';
export * from '@shopgate/pwa-core/constants/Scanner';

// HELPERS
export * from '@shopgate/pwa-common-commerce/scanner/helpers';

// STREAMS
export * from '@shopgate/pwa-common-commerce/scanner/streams';
