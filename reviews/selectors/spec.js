/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { getReviews } from './index';
import {
  existingHash,
  emptyState,
  finalState,
} from './mock';

describe('Reviews selectors', () => {
  describe('getReviews', () => {
    it('should return reviews when reviews are available', () => {
      const reviews = getReviews(finalState);
      expect(reviews).toEqual(finalState.reviews.reviewsByHash[existingHash].reviews);
    });
    it('should return null when state has no reviews for current product', () => {
      const state = Object.assign({}, finalState);
      state.product.currentProduct.productId = null;
      const reviews = getReviews(state);
      expect(reviews).toBe(null);
    });
    it('should return null when state is empty', () => {
      const reviews = getReviews(emptyState);
      expect(reviews).toBe(null);
    });
  });
});
