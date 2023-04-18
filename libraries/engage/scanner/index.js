/** @module scanner */

// ACTION-CREATORS
export { default as startScanner } from '@shopgate/pwa-common-commerce/scanner/action-creators/startScanner';
export { default as successHandleScanner } from '@shopgate/pwa-common-commerce/scanner/action-creators/successHandleScanner';
export { default as errorHandleScanner } from '@shopgate/pwa-common-commerce/scanner/action-creators/errorHandleScanner';

// ACTIONS
export { default as handleBarCode } from '@shopgate/pwa-common-commerce/scanner/actions/handleBarCode';
export { default as handleQrCode } from '@shopgate/pwa-common-commerce/scanner/actions/handleQrCode';
export { default as handleSearch } from '@shopgate/pwa-common-commerce/scanner/actions/handleSearch';
export { default as handleNoResults } from '@shopgate/pwa-common-commerce/scanner/actions/handleNoResults';

export { default as scanner } from '@shopgate/pwa-core/classes/Scanner';

// CONSTANTS
export * from '@shopgate/pwa-common-commerce/scanner/constants';
export * from '@shopgate/pwa-common-commerce/scanner/constants/Portals';
export * from '@shopgate/pwa-core/constants/Scanner';

// HELPERS
export * from '@shopgate/pwa-common-commerce/scanner/helpers';

// STREAMS
export * from '@shopgate/pwa-common-commerce/scanner/streams';
