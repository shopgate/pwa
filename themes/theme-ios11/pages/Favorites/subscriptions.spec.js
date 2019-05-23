import { UIEvents } from '@shopgate/engage/core';
import { createMockStore } from '@shopgate/pwa-common/store';
import { REQUEST_REMOVE_FAVORITES } from '@shopgate/engage/favorites';
import subscriber from './subscriptions';

const store = createMockStore(() => {}, subscriber);

describe('Favorites Subscriptions', () => {
  it('should display a toast message when an item was deleted', (done) => {
    store.dispatch({ type: REQUEST_REMOVE_FAVORITES });
    setTimeout(() => {
      expect(UIEvents.emit).toHaveBeenCalled();
      done();
    }, 500);
  });
});
