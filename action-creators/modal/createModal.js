/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { CREATE_MODAL } from '../../constants/ActionTypes';

/**
 * Creates the dispatched CREATE_MODAL action object.
 * @param {Object} options The modal options.
 * @return {Object} A Redux action.
 */
const createModal = options => ({
  type: CREATE_MODAL,
  options,
});

export default createModal;
