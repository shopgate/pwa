import { CATEGORY_PATH } from '@shopgate/pwa-common-commerce/category/constants';
import { createStore } from './specHelper';
import { pwaDidAppear } from '../action-creators';
import { categoryIsReady$ } from './category';

describe.skip('Search streams', () => {
  let categoryIsReadySubscriber;

  beforeEach(() => {
    categoryIsReadySubscriber = jest.fn();
    categoryIsReady$.subscribe(categoryIsReadySubscriber);
  });

  describe('categoryIsReady$', () => {
    describe('coming back from legacy pages', () => {
      it('should emit when pwaDidAppear is dispatched and a category path is active', () => {
        const { dispatch } = createStore(CATEGORY_PATH);
        dispatch(pwaDidAppear());
        expect(categoryIsReadySubscriber).toHaveBeenCalledTimes(1);
      });

      it('should not emit when pwaDidAppear is dispatched and no category path is active', () => {
        const { dispatch } = createStore('/somepath');
        dispatch(pwaDidAppear());
        expect(categoryIsReadySubscriber).not.toHaveBeenCalled();
      });
    });
  });
});
