import {
  SUCCESS_LOGIN,
  RECEIVE_USER,
} from '@shopgate/pwa-common/constants/ActionTypes';
import { mainSubject } from '@shopgate/pwa-common/store/middelwares/streams';
import { loginSuccess$ } from './user';

const mockedReceiveUser = {
  action: {
    type: RECEIVE_USER,
    user: {
      id: 'abc123',
      firstName: 'John',
      lastName: 'Doe',
    },
  },
};

/**
 * Simulate dispatch of the SUCCESS_LOGIN action
 */
const dispatchReceiveUser = () => {
  mainSubject.next(mockedReceiveUser);
};

/**
 * Simulate dispatch of the SUCCESS_LOGIN action
 */
const dispatchSuccessLogin = () => {
  mainSubject.next({
    action: {
      type: SUCCESS_LOGIN,
    },
  });
};

describe('User streams', () => {
  let subscriber;
  let subscription;

  beforeEach(() => {
    jest.clearAllMocks();
    subscriber = jest.fn();
  });

  describe('loginSuccess$', () => {
    beforeEach(() => {
      subscription = loginSuccess$.subscribe(subscriber);
    });

    afterEach(() => {
      subscription.unsubscribe();
    });

    it('should emit after the user logged in, and user data was received', () => {
      dispatchSuccessLogin();
      expect(subscriber).not.toHaveBeenCalled();
      dispatchReceiveUser();
      expect(subscriber).toHaveBeenCalledTimes(1);
      expect(subscriber).toHaveBeenCalledWith(mockedReceiveUser);
    });

    it('should only emit if both actions are dispatched in the correct order', () => {
      dispatchReceiveUser();
      expect(subscriber).not.toHaveBeenCalled();
      dispatchReceiveUser();
      expect(subscriber).not.toHaveBeenCalled();
      dispatchSuccessLogin();
      expect(subscriber).not.toHaveBeenCalled();
      dispatchReceiveUser();
      expect(subscriber).toHaveBeenCalledTimes(1);
      expect(subscriber).toHaveBeenCalledWith(mockedReceiveUser);
      dispatchReceiveUser();
      expect(subscriber).toHaveBeenCalledTimes(1);
    });
  });
});
