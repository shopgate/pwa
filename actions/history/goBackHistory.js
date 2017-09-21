/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { history } from '../../helpers/router';

/**
 * Goes back in history.
 * @param {number} [amount=1] The optional number of steps to go back. Defaults to 1.
 * @returns {Function} A redux thunk.
 */
export default (amount = 1) => () => {
  if (amount > 0) {
    history.go(-amount);
  }
};
