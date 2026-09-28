import { createSelector } from 'reselect';
import { PAGINATION_TYPE_CURSOR } from '../constants/reviewSettings';
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

export const isFetchingReviewSettings = createSelector(
  getReviewSettingsState,
  settings => settings.isFetching ?? false
);

export const isReviewCursorPagination = createSelector(
  getReviewPaginationType,
  paginationType => paginationType === PAGINATION_TYPE_CURSOR
);

/**
 * Whether the active provider reports a given optional capability. Unknown capabilities
 * are simply not present, so they enable nothing.
 * @param state The application state.
 * @param feature The capability identifier to check.
 * @returns Whether the capability is enabled.
 */
export const hasReviewFeature = (state: ReviewSettingsState, feature: string): boolean =>
  getReviewFeatures(state).includes(feature);
