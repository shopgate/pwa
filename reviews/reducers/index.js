/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { combineReducers } from 'redux';
import reviewsByHash from './reviewsByHash';
import reviewsById from './reviewsById';
import reviewsByProductId from './reviewsByProductId';
import userReviewsByProductId from './userReviewsByProductId';

export default combineReducers({
  reviewsByHash,
  reviewsById,
  reviewsByProductId,
  userReviewsByProductId,
});
