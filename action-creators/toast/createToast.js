/**
 * Copyright (c) 2018, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CREATE_TOAST } from '../../constants/ActionTypes';

let currentId = 0;
/**
 * Gets the next id.
 * @return {number}
 */
const getNextId = () => {
  currentId += 1;
  return currentId;
};

/**
 * Creates the dispatched CREATE_TOAST action object.
 * @param {Object} options The modal options.
 * @return {Object} A Redux action.
 */
const createToast = options => ({
  type: CREATE_TOAST,
  options: {
    ...options,
    id: getNextId(),
  },
});

export default createToast;
