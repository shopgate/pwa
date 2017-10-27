/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { RESET_SUBMIT_REVIEW } from '../constants';

/**
 * Dispatches the RESET_SUBMIT_REVIEW action.
 * @param {Object} review Review data.
 * @returns {Object} The RESET_SUBMIT_REVIEW action
 */
const resetSubmittedReview = review => ({
  type: RESET_SUBMIT_REVIEW,
  review,
});

export default resetSubmittedReview;
