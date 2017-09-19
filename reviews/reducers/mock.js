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

const reviews = finalState.reviews.reviewsByHash[existingHash].reviews;

let currentId = reviews.length;
const moreReviews = reviews.slice(0).map(
  (incomingEl) => {
    const el = incomingEl;
    currentId += 1;
    el.id = currentId;
    return el;
  });

export const mockedReviews = reviews;
export const moreMockedReviews = moreReviews;
export const totalReviewCount = reviews.length + moreReviews.length;
