/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as actionTypes from '../constants';
import * as subjects from './index';

const subjectActionsTypes = {
  requestReviewSubmit$: [actionTypes.REQUEST_SUBMIT_REVIEW],
  responseReviewSubmit$: [
    actionTypes.RECEIVE_SUBMIT_REVIEW,
    actionTypes.ERROR_SUBMIT_REVIEW,
    actionTypes.RESET_SUBMIT_REVIEW,
  ],
  successReviewSubmit$: [actionTypes.RECEIVE_SUBMIT_REVIEW],
  errorReviewSubmit$: [actionTypes.ERROR_SUBMIT_REVIEW, actionTypes.RESET_SUBMIT_REVIEW],
};

describe('Reviews streams', () => {
  it('should filter correctly', () => {
    const possibleSubjects = Object.keys(subjects);
    Object.keys(actionTypes).forEach((typeName) => {
      const type = actionTypes[typeName];
      possibleSubjects.forEach((subjectName) => {
        const result = subjects[subjectName].operator.predicate({ action: { type } });
        const shouldBe = subjectActionsTypes[subjectName].includes(type);
        expect(result).toBe(shouldBe);
      });
    });
  });
});
