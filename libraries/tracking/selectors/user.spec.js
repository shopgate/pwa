import {
  DEFAULT_LOGIN_STRATEGY,
  isUserLoggedIn,
  getUserData,
  makeGetLoginStrategy,
} from '@shopgate/engage/user';

import { makeGetUser } from './user';

const mockDefaultStrategy = 'default';
const mockUserData = {
  id: 'abc123',
  firstName: 'John',
  lastName: 'Doe',
  isFetching: false,
  loginType: 'userAccount',
};

const { isFetching, loginType, ...mockTrackableData } = mockUserData;

const mockLoginStrategy = DEFAULT_LOGIN_STRATEGY;

jest.mock('@shopgate/engage/user', () => ({
  DEFAULT_LOGIN_STRATEGY: mockDefaultStrategy,
  isUserLoggedIn: jest.fn(),
  getUserData: jest.fn(),
  makeGetLoginStrategy: jest.fn(),
}));

describe('User selectors', () => {
  const getLoginStrategy = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    isUserLoggedIn.mockReturnValue(true);
    getUserData.mockReturnValue(mockUserData);
    makeGetLoginStrategy.mockReturnValue(getLoginStrategy);
    getLoginStrategy.mockReturnValue(mockLoginStrategy);
  });

  describe('makeGetUser()', () => {
    let getUser;

    beforeEach(() => {
      getUser = makeGetUser();
    });

    it('should return different selector instances', () => {
      expect(getUser).not.toBe(makeGetUser());
    });

    it('should return NULL when the user is not logged in', () => {
      isUserLoggedIn.mockReturnValueOnce(false);
      expect(getUser({})).toBeNull();
    });

    it('should return NULL when no user data is available', () => {
      getUserData.mockReturnValueOnce(null);
      expect(getUser({})).toBeNull();
    });

    it('should return NULL when the user data does not contain trackable properties', () => {
      getUserData.mockReturnValueOnce({
        isFetching: false,
        loginType: 'userGuest',
      });
      expect(getUser({})).toBeNull();
    });

    it('should return the expected data when a special login strategy was used', () => {
      getLoginStrategy.mockReturnValueOnce('special');
      expect(getUser({})).toEqual({
        ...mockTrackableData,
        type: 'special',
      });
    });

    it('should return the expected data when the login type is userGuest', () => {
      getUserData.mockReturnValueOnce({
        ...mockUserData,
        loginType: 'userGuest',
      });
      expect(getUser({})).toEqual({
        ...mockTrackableData,
        type: 'guest',
      });
    });

    it('should return the expected data when the login type is userAccount', () => {
      getUserData.mockReturnValueOnce({
        ...mockUserData,
        loginType: 'userAccount',
      });
      expect(getUser({})).toEqual({
        ...mockTrackableData,
        type: 'standard',
      });
    });

    it('should return the expected data when an unknown login type is set', () => {
      getUserData.mockReturnValueOnce({
        ...mockUserData,
        loginType: 'unknown',
      });
      expect(getUser({})).toEqual({
        ...mockTrackableData,
        type: null,
      });
    });
  });
});
