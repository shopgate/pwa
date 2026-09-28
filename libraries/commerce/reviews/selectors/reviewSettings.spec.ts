import type { ReviewSettingsSliceState, ReviewSettingsState } from '../types/reviewSettings';
import {
  getReviewSettingsState,
  getReviewFeatures,
  getReviewPaginationType,
  getReviewCustomFields,
  isFetchingReviewSettings,
  isReviewCursorPagination,
  hasReviewFeature,
} from './reviewSettings';

/**
 * Builds an application state carrying the given review settings slice.
 * @param reviewSettings The review settings slice.
 * @returns The application state.
 */
const buildState = (reviewSettings: ReviewSettingsSliceState): ReviewSettingsState => ({
  reviews: { reviewSettings },
});

describe('Reviews selectors: reviewSettings', () => {
  describe('missing slice', () => {
    it('should fall back to safe empty values', () => {
      const state = {} as ReviewSettingsState;

      expect(getReviewSettingsState(state)).toEqual({});
      expect(getReviewFeatures(state)).toEqual([]);
      expect(getReviewPaginationType(state)).toBeUndefined();
      expect(getReviewCustomFields(state)).toEqual([]);
      expect(isFetchingReviewSettings(state)).toBe(false);
      expect(isReviewCursorPagination(state)).toBe(false);
    });
  });

  describe('pagination', () => {
    it('should read the pagination mode independently of features', () => {
      const state = buildState({
        features: [],
        paginationType: 'offset',
        customFields: [],
      });

      expect(getReviewPaginationType(state)).toBe('offset');
      expect(isReviewCursorPagination(state)).toBe(false);
    });

    it('should report cursor pagination even when features is empty', () => {
      const state = buildState({
        features: [],
        paginationType: 'cursor',
        customFields: [],
      });

      expect(getReviewPaginationType(state)).toBe('cursor');
      expect(isReviewCursorPagination(state)).toBe(true);
    });

    it('should keep the pagination mode when features is missing', () => {
      const state = buildState({ paginationType: 'offset' });

      expect(getReviewPaginationType(state)).toBe('offset');
    });
  });

  describe('features', () => {
    it('should only report features the provider advertises', () => {
      const state = buildState({
        features: ['reviewRate', 'somethingUnknown'],
        paginationType: 'offset',
        customFields: [],
      });

      expect(hasReviewFeature(state, 'reviewRate')).toBe(true);
      expect(hasReviewFeature(state, 'somethingUnknown')).toBe(true);
      expect(hasReviewFeature(state, 'notAdvertised')).toBe(false);
    });
  });

  describe('customFields', () => {
    it('should support an empty custom fields array', () => {
      const state = buildState({
        features: [],
        paginationType: 'offset',
        customFields: [],
      });

      expect(getReviewCustomFields(state)).toEqual([]);
    });
  });

  describe('fetching', () => {
    it('should reflect the fetching flag', () => {
      expect(isFetchingReviewSettings(buildState({ isFetching: true }))).toBe(true);
      expect(isFetchingReviewSettings(buildState({ isFetching: false }))).toBe(false);
    });
  });
});
