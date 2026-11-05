import {
  REQUEST_PRODUCT_REVIEW_SETTINGS,
  RECEIVE_PRODUCT_REVIEW_SETTINGS,
} from '../constants';
import { errorProductReviewSettings } from '../action-creators/reviewSettings';
import reviewSettings from './reviewSettings';

describe('Reviews reducers: reviewSettings', () => {
  it('should return an empty slice as initial state', () => {
    expect(reviewSettings(undefined, { type: '@@INIT' } as never)).toEqual({});
  });

  it('should flag fetching and reset expiry on request', () => {
    expect(reviewSettings({}, { type: REQUEST_PRODUCT_REVIEW_SETTINGS })).toEqual({
      isFetching: true,
      expires: 0,
    });
  });

  it('should store the settings and set an expiry on receive', () => {
    const settings = {
      features: ['reviewVotes'],
      paginationType: 'offset' as const,
      customFields: [],
    };

    const state = reviewSettings(
      {
        isFetching: true,
        expires: 0,
      },
      {
        type: RECEIVE_PRODUCT_REVIEW_SETTINGS,
        settings,
      }
    );

    expect(state.features).toEqual(['reviewVotes']);
    expect(state.paginationType).toBe('offset');
    expect(state.customFields).toEqual([]);
    expect(state.isFetching).toBe(false);
    expect(state.expires).toBeGreaterThan(Date.now());
  });

  it('should reset fetching and expiry on error so the next attempt refetches', () => {
    expect(
      reviewSettings({
        isFetching: true,
        expires: 0,
      }, errorProductReviewSettings(new Error('failed')))
    ).toEqual({
      isFetching: false,
      expires: 0,
    });
  });

  it('should ignore unrelated actions', () => {
    const state = { paginationType: 'offset' as const };

    expect(reviewSettings(state, { type: 'SOMETHING_ELSE' } as never)).toBe(state);
  });
});
