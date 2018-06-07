import {
  createStore,
  updateHistoryWrapped,
} from './specHelper';
import { pwaDidAppear } from '../action-creators';
import {
  blacklistedPaths,
  pagesAreReady$,
} from './pages';

describe('Pages streams', () => {
  let pagesAreReadySubscriber;

  beforeEach(() => {
    pagesAreReadySubscriber = jest.fn();
    pagesAreReady$.subscribe(pagesAreReadySubscriber);
  });

  describe('pagesAreReady$', () => {
    describe('route changes', () => {
      it('should emit when a route is active which is not blacklisted', () => {
        const pathname = '/somepath';
        const { dispatch } = createStore(pathname);
        dispatch(updateHistoryWrapped(pathname));

        expect(pagesAreReadySubscriber).toHaveBeenCalledTimes(1);
      });

      it('should not emit when a blacklisted route is active', () => {
        const pathname = blacklistedPaths[0];
        const { dispatch } = createStore(pathname);
        dispatch(updateHistoryWrapped(pathname));

        expect(pagesAreReadySubscriber).not.toHaveBeenCalled();
      });
    });

    describe('coming back from legacy pages', () => {
      it('should emit when pwaDidAppear is dispatched and a not blacklisted route is active', () => {
        const { dispatch } = createStore('/somepath');
        dispatch(pwaDidAppear());
        expect(pagesAreReadySubscriber).toHaveBeenCalledTimes(1);
      });

      it('should not emit when pwaDidAppear is dispatched and a blacklisted is active', () => {
        const { dispatch } = createStore(blacklistedPaths[0]);
        dispatch(pwaDidAppear());
        expect(pagesAreReadySubscriber).not.toHaveBeenCalled();
      });
    });
  });
});
