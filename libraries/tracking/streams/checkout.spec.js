import { combineReducers } from 'redux';
import { createMockStore } from '@shopgate/pwa-common/store';
import user from '@shopgate/pwa-common/reducers/user';
import { CHECKOUT_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import { successLogin } from '@shopgate/pwa-common/action-creators/user';
import { historyPush, historyReplace, historyPop } from '@shopgate/pwa-common/actions/router';
import { checkoutDidEnter$ } from './checkout';

describe('Checkout streams', () => {
  let store;
  let dispatch;

  beforeEach(() => {
    store = createMockStore(combineReducers({ user }));
    ({ dispatch } = store);
  });

  describe('checkoutDidEnter$', () => {
    let checkoutDidEnterSubscriber;

    beforeEach(() => {
      checkoutDidEnterSubscriber = jest.fn();
      checkoutDidEnter$.subscribe(checkoutDidEnterSubscriber);
    });

    it('should not emit when a route is pushed which is not the checkout route', () => {
      dispatch(historyPush({ pathname: '/someroute' }));
      expect(checkoutDidEnterSubscriber).not.toHaveBeenCalled();
    });

    it('should not emit when the checkout route is pushed, but the user is not logged in', () => {
      dispatch(historyPush({ pathname: CHECKOUT_PATH }));
      expect(checkoutDidEnterSubscriber).not.toHaveBeenCalled();
    });

    it('should not emit when the checkout route is popped', () => {
      dispatch(historyPop({ pathname: CHECKOUT_PATH }));
      expect(checkoutDidEnterSubscriber).not.toHaveBeenCalled();
    });

    it('should emit when the checkout route is pushed for a logged in user', () => {
      dispatch(successLogin());
      dispatch(historyPush({ pathname: CHECKOUT_PATH }));
      expect(checkoutDidEnterSubscriber).toHaveBeenCalledTimes(1);
    });

    it('should emit when the checkout route is replaced for a logged in user', () => {
      dispatch(successLogin());
      dispatch(historyReplace({ pathname: CHECKOUT_PATH }));
      expect(checkoutDidEnterSubscriber).toHaveBeenCalledTimes(1);
    });
  });
});
