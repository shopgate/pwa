import {
  REQUEST_PRODUCT_REVIEW_SETTINGS,
  RECEIVE_PRODUCT_REVIEW_SETTINGS,
  ERROR_PRODUCT_REVIEW_SETTINGS,
} from '../constants/reviewSettings';
import {
  requestProductReviewSettings,
  receiveProductReviewSettings,
  errorProductReviewSettings,
} from './reviewSettings';

describe('Reviews action-creators: reviewSettings', () => {
  it('should create a request action', () => {
    expect(requestProductReviewSettings()).toEqual({
      type: REQUEST_PRODUCT_REVIEW_SETTINGS,
    });
  });

  it('should create a receive action carrying the settings', () => {
    const settings = {
      features: [],
      paginationType: 'offset' as const,
      customFields: [],
    };

    expect(receiveProductReviewSettings(settings)).toEqual({
      type: RECEIVE_PRODUCT_REVIEW_SETTINGS,
      settings,
    });
  });

  it('should create an error action carrying the error', () => {
    const error = new Error('failed');

    expect(errorProductReviewSettings(error)).toEqual({
      type: ERROR_PRODUCT_REVIEW_SETTINGS,
      error,
    });
  });
});
