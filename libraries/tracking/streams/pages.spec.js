import {
  createStore,
  updateHistoryWrapped,
} from './specHelper';
import { pwaDidAppear } from '../action-creators';
import {
  blacklistedPaths,
  pagesAreReady$,
} from './pages';
import { setPWAVisibleState } from '../helpers';

describe.skip('Pages streams', () => {
  let pagesAreReadySubscriber;

  beforeEach(() => {
    pagesAreReadySubscriber = jest.fn();
    pagesAreReady$.subscribe(pagesAreReadySubscriber);
  });

  describe('pagesAreReady$', () => {
    beforeEach(() => {
      setPWAVisibleState(true);
    });

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

      it('should not emit when a route is active, but the PWA is not visible', () => {
        setPWAVisibleState(false);
        const pathname = '/somepath';
        const { dispatch } = createStore(pathname);
        dispatch(updateHistoryWrapped(pathname));

        expect(pagesAreReadySubscriber).toHaveBeenCalledTimes(0);
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
