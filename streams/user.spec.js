/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import successLogin from '../action-creators/user/successLogin';
import receiveUser from '../action-creators/user/receiveUser';
import configureStore from '../store';
import { userDidLogin$, userDidUpdate$ } from './user';

jest.mock('redux-logger', () => ({
  createLogger: () => () => next => action => next(action),
}));

/**
 * A mocked dummy reducer to satisfy the store creation.
 * @param {Object} state The current redux state.
 * @return {Object} The unchanged state.
 */
const mockedReducer = (state = {}) => state;

describe('streams/user.js', () => {
  const { dispatch } = configureStore({ mocked: mockedReducer });
  let loginMockSubscriber;
  let updateMockSubscriber;

  beforeEach(() => {
    loginMockSubscriber = jest.fn();
    updateMockSubscriber = jest.fn();

    userDidLogin$.subscribe(loginMockSubscriber);
    userDidUpdate$.subscribe(updateMockSubscriber);
  });

  describe('Given the successLogin action gets dispatched', () => {
    beforeEach(() => {
      dispatch(successLogin());
    });

    it('should emit into userDidLogin$', () => {
      expect(loginMockSubscriber).toBeCalled();
      expect(loginMockSubscriber.mock.calls).toHaveLength(1);
    });
  });

  describe('Given the receiveUser action gets dispatched', () => {
    beforeEach(() => {
      dispatch(receiveUser());
    });

    it('should emit into userDidUpdate$', () => {
      expect(updateMockSubscriber).toBeCalled();
      expect(updateMockSubscriber.mock.calls).toHaveLength(1);
    });
  });
});
