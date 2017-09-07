/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import removeModal from '../../action-creators/modal/removeModal';
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
