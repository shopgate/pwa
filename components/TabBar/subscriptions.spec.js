import { LOGIN_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import { routeDidChange$ } from '@shopgate/pwa-common/streams/history';
import { setTabBarEnabled } from './actions';
import subscriptions from './subscriptions';

describe('TabBar subscriptions', () => {
  let mockedSubscribe;

  beforeAll(() => {
    mockedSubscribe = jest.fn();
    subscriptions(mockedSubscribe);
  });

  it('should call subscribe as expected', () => {
    expect(mockedSubscribe).toHaveBeenCalledTimes(1);
  });

  describe('routeDidChange$', () => {
    const dispatch = jest.fn();
    let stream;
    let callback;

    beforeAll(() => {
      // eslint-disable-next-line prefer-destructuring
      [stream, callback] = mockedSubscribe.mock.calls[0];
    });

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should be initialized as expected', () => {
      expect(stream).toEqual(routeDidChange$);
      expect(callback).toBeInstanceOf(Function);
    });

    it('should enable the tabbar on a not blacklisted route', () => {
      const pathname = '/somepath';

      callback({
        dispatch,
        pathname,
      });

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith(setTabBarEnabled(true));
    });

    it('should disable the tabbar on a blacklisted route', () => {
      const pathname = LOGIN_PATH;

      callback({
        dispatch,
        pathname,
      });

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith(setTabBarEnabled(false));
    });
  });
});
