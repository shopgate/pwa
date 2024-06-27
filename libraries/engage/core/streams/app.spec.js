import 'rxjs/add/observable/of';
import { mainSubject } from '@shopgate/pwa-common/store/middelwares/streams';
import { createMockStore } from '@shopgate/pwa-common/store';
import { ROUTE_DID_ENTER } from '@shopgate/engage/core/constants';
import { getRouterStack } from '@shopgate/engage/core/selectors';
import {
  reloadApp,
} from '../action-creators';
import {
  reloadApp$,
} from './app';

jest.mock('@shopgate/engage/core/selectors', () => ({
  getRouterStack: jest.fn(),
}));

describe('Engage app streams', () => {
  let subscriber;
  let subscription;
  let dispatch;

  beforeEach(() => {
    jest.clearAllMocks();
    ({ dispatch } = createMockStore());
    subscriber = jest.fn();
  });

  afterEach(() => {
    subscription.unsubscribe();
  });

  describe('reloadApp$', () => {
    beforeEach(() => {
      subscription = reloadApp$.subscribe(subscriber);
    });

    it('should emit when reloadApp action was dispatched and the initial route is /', () => {
      getRouterStack.mockReturnValueOnce([{
        id: '1337',
        pathname: '/',
      }]);

      dispatch(reloadApp());

      // Simulate navigation action
      mainSubject.next({
        action: {
          type: ROUTE_DID_ENTER,
          route: {
            pathname: '/',
            id: '1337',
          },
        },
      });

      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it('should emit when reloadApp action was dispatched and the initial route is /page/foobar', () => {
      getRouterStack.mockReturnValueOnce([{
        id: '1337',
        pathname: '/page/foobar',
      }]);

      dispatch(reloadApp());

      // Simulate navigation action
      mainSubject.next({
        action: {
          type: ROUTE_DID_ENTER,
          route: {
            pathname: '/page/foobar',
            id: '1337',
          },
        },
      });

      expect(subscriber).toHaveBeenCalledTimes(1);
    });
  });
});
