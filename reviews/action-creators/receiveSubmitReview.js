/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { RECEIVE_SUBMIT_REVIEW } from '../constants';

/**
 * Dispatches the RECEIVE_SUBMIT_REVIEW action.
 * @param {Object} review The received review data.
 * @returns {Object} The RECEIVE_SUBMIT_REVIEW action.
 */
const receiveSubmitReview = review => ({
  type: RECEIVE_SUBMIT_REVIEW,
  review,
});

export default receiveSubmitReview;
