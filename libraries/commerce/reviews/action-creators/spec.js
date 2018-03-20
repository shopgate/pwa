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

describe('Reviews action-creators', () => {
  describe('errorReviews', () => {
    it('should return correct action', () => {
      const action = errorReviews(hash);
      expect(action).toEqual({
        type: ERROR_REVIEWS,
        hash,
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
      const action = requestReviews(hash);
      expect(action).toEqual({
        type: REQUEST_REVIEWS,
        hash,
      });
    });
  });
});
