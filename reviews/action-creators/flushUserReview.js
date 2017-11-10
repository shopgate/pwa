/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FLUSH_USER_REVIEWS } from '../constants';

/**
 * Dispatches the FLUSH_USER_REVIEWS action.
 * @returns {Object} The FLUSH_USER_REVIEWS action
 */
const receiveProductReviews = () => ({
  type: FLUSH_USER_REVIEWS,
});

export default receiveProductReviews;
