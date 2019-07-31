/** @module scanner */

// ACTION-CREATORS
export { default as startScanner } from '@shopgate/pwa-common-commerce/scanner//action-creators/startScanner';

// ACTIONS
export { default as handleBarCode } from '@shopgate/pwa-common-commerce/scanner/actions/handleBarCode';
export { default as handleQrCode } from '@shopgate/pwa-common-commerce/scanner/actions/handleQrCode';

export { default as scanner } from '@shopgate/pwa-core/classes/Scanner';

// CONSTANTS
export * from '@shopgate/pwa-common-commerce/scanner/constants';
export * from '@shopgate/pwa-common-commerce/scanner/constants/Portals';
export * from '@shopgate/pwa-core/constants/Scanner';

// HELPERS
export * from '@shopgate/pwa-common-commerce/scanner/helpers';

// STREAMS
export * from '@shopgate/pwa-common-commerce/scanner/streams';
