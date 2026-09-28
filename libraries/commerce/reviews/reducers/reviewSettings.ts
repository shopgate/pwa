import type { Reducer, UnknownAction } from 'redux';
import {
  REQUEST_PRODUCT_REVIEW_SETTINGS,
  RECEIVE_PRODUCT_REVIEW_SETTINGS,
  ERROR_PRODUCT_REVIEW_SETTINGS,
  REVIEW_SETTINGS_LIFETIME,
} from '../constants/reviewSettings';
import type { ReceiveProductReviewSettingsAction } from '../action-creators/reviewSettings';
import type { ReviewSettingsSliceState } from '../types/reviewSettings';

type ReviewSettingsAction = ReceiveProductReviewSettingsAction | UnknownAction;

const isReceiveProductReviewSettingsAction = (
  action: ReviewSettingsAction
): action is ReceiveProductReviewSettingsAction => (
  action.type === RECEIVE_PRODUCT_REVIEW_SETTINGS && 'settings' in action
);

/**
 * Stores the product review settings with request bookkeeping.
 * @param state The current state.
 * @param action The action object.
 * @returns The new state.
 */
const reviewSettings: Reducer<ReviewSettingsSliceState, ReviewSettingsAction> = (
  state = {},
  action = { type: '' }
) => {
  if (isReceiveProductReviewSettingsAction(action)) {
    return {
      ...state,
      ...action.settings,
      isFetching: false,
      expires: Date.now() + REVIEW_SETTINGS_LIFETIME,
    };
  }

  switch (action.type) {
    case REQUEST_PRODUCT_REVIEW_SETTINGS:
      return {
        ...state,
        isFetching: true,
        expires: 0,
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
