import { mainSubject } from '@shopgate/pwa-common/store/middelwares/streams';
import { createMockStore } from '@shopgate/pwa-common/store';
import { ROUTE_DID_ENTER } from '@shopgate/engage/core/constants';
import {
  reloadApp,
} from '../action-creators';
import {
  reloadApp$,
} from './app';

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

    it('should emit when reloadApp action was dispatched', () => {
      dispatch(reloadApp());

      // Simulate navigation action
      mainSubject.next({
        action: {
          type: ROUTE_DID_ENTER,
          route: {
            pathname: '/',
          },
        },
      });

      expect(subscriber).toHaveBeenCalledTimes(1);
    });
  });
});
