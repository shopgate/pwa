import { loginDidFail$ } from '@shopgate/engage/user';
import * as helpers from '../helpers';
import subscription from './user';

const mockedGetUser = jest.fn().mockReturnValue('getUser');
jest.mock('../selectors/user', () => ({
  makeGetUser: () => mockedGetUser,
}));

describe('User subscriptions', () => {
  const subscribe = jest.fn();
  const getState = jest.fn().mockReturnValue('getState');
  const trackSpy = jest.spyOn(helpers, 'track');

  beforeEach(() => {
    jest.clearAllMocks();
    subscription(subscribe);
  });

  it('should call subscribe as expected', () => {
    expect(subscribe).toHaveBeenCalledTimes(2);
  });

  describe('loginSuccess$', () => {
    let callback;

    beforeAll(() => {
      [[, callback]] = subscribe.mock.calls;
    });

    it('should track the loginSuccess event', () => {
      callback({ getState });
      expect(trackSpy).toHaveBeenCalledTimes(1);
      expect(trackSpy).toHaveBeenCalledWith('loginSuccess', 'getUser', 'getState');
    });
  });

  describe('loginDidFail$', () => {
    let stream;
    let callback;

    beforeAll(() => {
      [, [stream, callback]] = subscribe.mock.calls;
    });

    it('should subscribe the the correct stream', () => {
      expect(stream).toBe(loginDidFail$);
    });

    it('should track the loginFailed event', () => {
      callback({ getState });
      expect(trackSpy).toHaveBeenCalledTimes(1);
      expect(trackSpy).toHaveBeenCalledWith('loginFailed', undefined, 'getState');
    });
  });
});
