/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { main$ } from '@shopgate/pwa-common/streams/main';
import {
  REQUEST_SUBMIT_REVIEW,
  RECEIVE_SUBMIT_REVIEW,
  ERROR_SUBMIT_REVIEW,
  RESET_SUBMIT_REVIEW,
} from '../constants';

/**
 * Gets triggered when the user tried to submit a review.
 * @type {Observable}
 */
export const requestReviewSubmit$ = main$.filter(({ action }) => (
  action.type === REQUEST_SUBMIT_REVIEW
));

/**
 * Gets triggered when the user tried to submit a review.
 * @type {Observable}
 */
export const responseReviewSubmit$ = main$.filter(({ action }) => (
  [RECEIVE_SUBMIT_REVIEW, ERROR_SUBMIT_REVIEW, RESET_SUBMIT_REVIEW].includes(action.type)
));

/**
 * Gets triggered when the user submit was successful.
 * @type {Observable}
 */
export const successReviewSubmit$ = main$.filter(({ action }) => (
  action.type === RECEIVE_SUBMIT_REVIEW
));

/**
 * Gets triggered when the user submit was not successful.
 * @type {Observable}
 */
export const errorReviewSubmit$ = main$.filter(({ action }) => (
  [ERROR_SUBMIT_REVIEW, RESET_SUBMIT_REVIEW].includes(action.type)
));
