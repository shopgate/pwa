/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { REQUEST_SUBMIT_REVIEW } from '../constants';

/**
 * Dispatches the REQUEST_SUBMIT_REVIEW action.
 * @param {Object} review The review data.
 * @returns {Object} The REQUEST_SUBMIT_REVIEW action.
 */
const requestSubmitReview = review => ({
  type: REQUEST_SUBMIT_REVIEW,
  review,
});

export default requestSubmitReview;
