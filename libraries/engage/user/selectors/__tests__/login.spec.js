import { makeGetLoginStrategy } from '../login';

const mockedState = {
  user: {
    login: {
      isFetching: false,
      disabled: false,
      isLoggedIn: true,
      errors: null,
      strategy: 'default',
    },
  },
};

describe('engage > user > selectors > login', () => {
  describe('getProductMedia()', () => {
    let getLoginStrategy;

    beforeEach(() => {
      getLoginStrategy = makeGetLoginStrategy();
    });

    it('should return different selector instances', () => {
      expect(getLoginStrategy).not.toBe(makeGetLoginStrategy());
    });

    it('should return NULL when the store is empty', () => {
      const result = getLoginStrategy({});
      expect(result).toBeNull();
    });

    it('should return NULL when the login state does not contain a strategy', () => {
      const result = getLoginStrategy({
        user: {
          login: {
            ...mockedState.user.login,
            strategy: null,
          },
        },
      });
      expect(result).toBeNull();
    });

    it('should return a login strategy', () => {
      const result = getLoginStrategy(mockedState);
      expect(result).toBe(mockedState.user.login.strategy);
    });
  });
});
