/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { REMOVE_MODAL } from '../../constants/ActionTypes';

/**
 * Creates the dispatched REMOVE_MODAL action object.
 * @param {string} id The modal id to remove.
 * @return {Object} A Redux action.
 */
const removeModal = id => ({
  type: REMOVE_MODAL,
  id,
});

export default removeModal;
