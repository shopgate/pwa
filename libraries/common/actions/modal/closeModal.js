import { removeModal } from '../../action-creators/modal';
import promiseMap from './promiseMap';

/**
 * Closes an open modal and resolves the mapped promise.
 * @param {number} id A modal id.
 * @param {boolean} confirmed A flag whether the modal was confirmed or not.
 * @returns {Function} A redux thunk.
 */
const closeModal = (id, confirmed = false) => (dispatch) => {
  const promise = promiseMap.get(id);

  if (promise) {
    promise.resolve(confirmed);
  }

  dispatch(removeModal(id));
};

export default closeModal;
