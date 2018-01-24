/**
 * Copyright (c) 2017 - present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { REMOVE_TOAST } from '../../constants/ActionTypes';

/**
 * Creates the dispatched REMOVE_TOAST action object.
 * @param {Object} id The toast id.
 * @return {Object} A Redux action.
 */
const removeToast = id => ({
  type: REMOVE_TOAST,
  id,
});

export default removeToast;
