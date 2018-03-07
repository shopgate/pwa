/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { history } from '../../helpers/router';

/**
 * Goes back one or more entries within the browse history.
 * @param {number} [amount=1] The number of steps to go back. Defaults to 1.
 * @returns {Function} A redux thunk.
 */
const goBackHistory = (amount = 1) => () => {
  if (amount > 0) {
    history.go(-amount);
  }
};

export default goBackHistory;
