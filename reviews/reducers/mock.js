/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  finalState,
  existingHash,
} from '../selectors/mock';

const { reviews } = finalState.reviews.reviewsByHash[existingHash];

let currentId = reviews.length;
// Copy of reviews with different ids.
const moreReviews = reviews.map(
  (review) => {
    currentId += 1;
    return {
      ...review,
      id: currentId,
    };
  }
);

export const mockedReviews = reviews;
export const moreMockedReviews = moreReviews;
export const totalReviewCount = reviews.length + moreReviews.length;
