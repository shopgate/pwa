import CryptoJs from 'crypto-js';
import { logger } from '@shopgate/pwa-core';
import { createModal } from '../../action-creators/modal';
import { mutable } from '../../helpers/redux';
import { getModalById } from '../../selectors/modal';
import promiseMap from './promiseMap';

/**
 * Creates a runtime unique modal id.
 * @param {Object} options The modal options.
 * @returns {number}
 */
export const getModalId = options => CryptoJs.MD5(JSON.stringify(options)).toString();

/**
 * The modal defaults.
 * @type {Object}
 */
const defaultModalOptions = {
  id: null,
  type: null, // In this case the template should display a fallback dialog type.
  title: '',
  confirm: 'modal.confirm',
  dismiss: 'modal.dismiss',
  params: {}, // Any parameters for special modal types go here.
};

/**
 * Dispatches the createModal action creator and returns
 * a promise that will be resolved when the modal closes.
 * @param {Object} options The modal options.
 * @return {Function} A Redux thunk.
 */
function showModal(options) {
  return (dispatch, getState) => {
    const id = getModalId(options);

    // Check if there is already a modal with the same id on the modal stack.
    const modal = getModalById(getState(), id);

    if (modal) {
      /**
       * To prevent bugging the user with duplicate modal, those are not added to the modal stack.
       * Usually the promise which is returned by showModal resolves with a boolean value
       * when the user interacts with its buttons. Since promise handling is optional for the
       * action, the promise can't be rejected, but resolves with null.
       */
      logger.warn('Modal creation aborted since an identical one was already added to the modal stack', options);
      return Promise.resolve(null);
    }

    const enrichedOptions = {
      ...defaultModalOptions,
      ...options,
      id,
    };

    dispatch(createModal(enrichedOptions));

    return new Promise((resolve, reject) => {
      promiseMap.set(id, {
        resolve,
        reject,
      });
    });
  };
}

/** @mixes {MutableFunction} */
export default mutable(showModal);
