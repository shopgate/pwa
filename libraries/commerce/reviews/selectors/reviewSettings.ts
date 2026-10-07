import { createSelector } from 'reselect';
import { PAGINATION_TYPE_CURSOR, REVIEW_FILTERS, REVIEW_SORT_OPTIONS } from '../constants';
import type { ReviewFilterOption } from '../types/reviews';
import type {
  ReviewPaginationType,
  ReviewSettingsSliceState,
  ReviewSettingsState,
} from '../types/reviewSettings';

const EMPTY_SETTINGS: ReviewSettingsSliceState = {};

/**
 * Retrieves the review settings slice, falling back to an empty slice when absent.
 * @param state The application state.
 * @returns The review settings slice.
 */
export const getReviewSettingsState = (state: ReviewSettingsState): ReviewSettingsSliceState =>
  state?.reviews?.reviewSettings ?? EMPTY_SETTINGS;

export const getReviewFeatures = createSelector(
  getReviewSettingsState,
  settings => settings.features ?? []
);

/**
 * Selects the pagination mode from the settings only. Returns `undefined` while unknown;
 * never derived from `features` and never defaulted to offset.
 */
export const getReviewPaginationType = createSelector(
  getReviewSettingsState,
  (settings): ReviewPaginationType | undefined => settings.paginationType
);

export const getReviewCustomFields = createSelector(
  getReviewSettingsState,
  settings => settings.customFields ?? []
);

/**
 * Selects the sort values the provider supports, limited to the values of the pipeline contract
 * and kept in the provider's order.
 */
export const getReviewSortOptions = createSelector(
  getReviewSettingsState,
  (settings): string[] => (Array.isArray(settings.sortOptions)
    ? settings.sortOptions.filter(option => REVIEW_SORT_OPTIONS.includes(option))
    : [])
);

/**
 * Selects the list filters the provider supports, in the order the PWA defines them.
 */
export const getReviewFilterOptions = createSelector(
  getReviewFeatures,
  (features): ReviewFilterOption[] => (REVIEW_FILTERS as (ReviewFilterOption & {
    feature: string;
  })[])
    .filter(filter => features.includes(filter.feature))
    .map(({ param, type, label }) => ({
      param,
      type,
      label,
    }))
);

export const isFetchingReviewSettings = createSelector(
  getReviewSettingsState,
  settings => settings.isFetching ?? false
);

export const isReviewCursorPagination = createSelector(
  getReviewPaginationType,
  paginationType => paginationType === PAGINATION_TYPE_CURSOR
);

/**
 * Whether the active provider reports the given capability. A capability missing from the
 * settings enables nothing.
 * @param state The application state.
 * @param feature The capability identifier to check.
 * @returns Whether the capability is enabled.
 */
export const hasReviewFeature = (state: ReviewSettingsState, feature: string): boolean =>
  getReviewFeatures(state).includes(feature);
