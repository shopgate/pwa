import {
  REQUEST_PRODUCT_REVIEW_SETTINGS,
  RECEIVE_PRODUCT_REVIEW_SETTINGS,
  ERROR_PRODUCT_REVIEW_SETTINGS,
} from '../constants';
import type { ReviewSettings } from '../types/reviewSettings';

/**
 * Creates the REQUEST_PRODUCT_REVIEW_SETTINGS action.
 * @returns The dispatched action.
 */
export const requestProductReviewSettings = () => ({
  type: REQUEST_PRODUCT_REVIEW_SETTINGS,
});

/**
 * Creates the RECEIVE_PRODUCT_REVIEW_SETTINGS action.
 * @param settings The review settings returned by the pipeline.
 * @returns The dispatched action.
 */
export const receiveProductReviewSettings = (settings: ReviewSettings) => ({
  type: RECEIVE_PRODUCT_REVIEW_SETTINGS,
  settings,
});

/**
 * Creates the ERROR_PRODUCT_REVIEW_SETTINGS action.
 * @param error The error that occurred while requesting the settings.
 * @returns The dispatched action.
 */
export const errorProductReviewSettings = (error: unknown) => ({
  type: ERROR_PRODUCT_REVIEW_SETTINGS,
  error,
});

export type RequestProductReviewSettingsAction = ReturnType<typeof requestProductReviewSettings>;
export type ReceiveProductReviewSettingsAction = ReturnType<typeof receiveProductReviewSettings>;
export type ErrorProductReviewSettingsAction = ReturnType<typeof errorProductReviewSettings>;
