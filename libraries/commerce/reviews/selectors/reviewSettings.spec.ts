import type { ReviewSettingsSliceState, ReviewSettingsState } from '../types/reviewSettings';
import {
  getReviewSettingsState,
  getReviewFeatures,
  getReviewPaginationType,
  getReviewCustomFields,
  isFetchingReviewSettings,
  isReviewCursorPagination,
  hasReviewFeature,
  getReviewSortOptions,
  getReviewFilterOptions,
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

  describe('getReviewSortOptions', () => {
    it('should keep the contract values in the order of the provider', () => {
      expect(getReviewSortOptions(buildState({
        sortOptions: ['rateDesc', 'helpfulDesc', 'dateDesc'],
      }))).toEqual(['rateDesc', 'dateDesc']);
    });

    it('should return no options when the provider reports none or an invalid value', () => {
      expect(getReviewSortOptions(buildState({}))).toEqual([]);
      expect(getReviewSortOptions(buildState({
        sortOptions: 'dateDesc' as unknown as string[],
      }))).toEqual([]);
    });
  });

  describe('getReviewFilterOptions', () => {
    it('should return the filters the provider reports in the order of the PWA', () => {
      expect(getReviewFilterOptions(buildState({
        features: ['verifiedFilter', 'reviewRate', 'mediaFilter'],
      }))).toEqual([
        {
          param: 'filterMedia',
          label: 'reviews.filter_media',
        },
        {
          param: 'filterVerified',
          label: 'reviews.filter_verified',
        },
      ]);
    });

    it('should return no filters without matching capabilities', () => {
      expect(getReviewFilterOptions(buildState({ features: ['reviewRate'] }))).toEqual([]);
      expect(getReviewFilterOptions(buildState({}))).toEqual([]);
    });
  });
});
