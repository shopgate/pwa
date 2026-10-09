import type { Reducer } from 'redux';
import {
  REQUEST_PRODUCT_REVIEW_SETTINGS,
  RECEIVE_PRODUCT_REVIEW_SETTINGS,
  ERROR_PRODUCT_REVIEW_SETTINGS,
  REVIEW_SETTINGS_LIFETIME,
} from '../constants';
import type {
  RequestProductReviewSettingsAction,
  ReceiveProductReviewSettingsAction,
  ErrorProductReviewSettingsAction,
} from '../action-creators/reviewSettings';
import type { ReviewSettingsSliceState } from '../types/reviewSettings';

type ReviewSettingsAction =
  | RequestProductReviewSettingsAction
  | ReceiveProductReviewSettingsAction
  | ErrorProductReviewSettingsAction;

/**
 * Stores the product review settings with request bookkeeping.
 * @param state The current state.
 * @param action The action object.
 * @returns The new state.
 */
const reviewSettings: Reducer<ReviewSettingsSliceState, ReviewSettingsAction> = (
  state = {},
  action = {} as ReviewSettingsAction
) => {
  switch (action.type) {
    case REQUEST_PRODUCT_REVIEW_SETTINGS:
      return {
        ...state,
        isFetching: true,
        expires: 0,
      };
    case RECEIVE_PRODUCT_REVIEW_SETTINGS:
      return {
        ...state,
        ...action.settings,
        isFetching: false,
        expires: Date.now() + REVIEW_SETTINGS_LIFETIME,
      };
    case ERROR_PRODUCT_REVIEW_SETTINGS:
      return {
        ...state,
        isFetching: false,
        expires: 0,
      };
    default:
      return state;
  }
};

export default reviewSettings;
