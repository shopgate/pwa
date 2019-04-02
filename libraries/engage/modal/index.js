/** @module modal */

// ACTIONS
export { default as closeModal } from '@shopgate/pwa-common/actions/modal/closeModal';
export { default as promiseMap } from '@shopgate/pwa-common/actions/modal/promiseMap';
export { default as showModal } from '@shopgate/pwa-common/actions/modal/showModal';

// CONSTANTS
export * from '@shopgate/pwa-common/constants/ModalTypes';

// HELPERS
export { default as withShowModal } from '@shopgate/pwa-common/helpers/modal/withShowModal';

// SELECTORS
export * from '@shopgate/pwa-common/selectors/modal';
