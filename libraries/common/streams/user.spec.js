import {
  successLogin,
  receiveUser,
} from '../action-creators/user';
import { configureStore } from '../store';
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

describe.skip('streams/user.js', () => {
  let dispatch;
  let loginMockSubscriber;
  let updateMockSubscriber;

  beforeEach(() => {
    ({ dispatch } = configureStore({ mocked: mockedReducer }));
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
