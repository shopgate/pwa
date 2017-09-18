/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import errorReviews from './errorReviews';
import receiveReviews from './receiveReviews';
import requestReviews from './requestReviews';

import {
  ERROR_REVIEWS,
  RECEIVE_REVIEWS,
  REQUEST_REVIEWS,
} from '../constants/index';

const hash = 'foo';
const productId = '1';
const limit = 20;
const offset = 0;

describe('Reviews action-creators', () => {
  describe('errorReviews', () => {
    it('should return correct action', () => {
      const action = errorReviews(hash, productId, limit, offset);
      expect(action).toEqual({
        type: ERROR_REVIEWS,
        hash,
        productId,
        limit,
        offset,
      });
    });
  });
  describe('receiveReviews', () => {
    it('should return correct action', () => {
      const reviews = [];
      const totalReviewCount = 20;
      const action = receiveReviews(hash, productId, reviews, totalReviewCount);
      expect(action).toEqual({
        type: RECEIVE_REVIEWS,
        hash,
        productId,
        reviews,
        totalReviewCount,
      });
    });
  });
  describe('requestReviews', () => {
    it('should return correct action', () => {
      const action = requestReviews(hash, productId, limit, offset);
      expect(action).toEqual({
        type: REQUEST_REVIEWS,
        hash,
        productId,
        limit,
        offset,
      });
    });
  });
});
