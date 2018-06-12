import { SEARCH_PATH } from '@shopgate/pwa-common-commerce/search/constants';
import receiveSearchResults from '@shopgate/pwa-common-commerce/search/action-creators/receiveSearchResults';
import {
  createStore,
  updateHistoryWrapped,
} from './specHelper';
import { pwaDidAppear } from '../action-creators';
import { searchIsReady$ } from './search';

describe('Search streams', () => {
  let searchIsReadySubscriber;

  beforeEach(() => {
    searchIsReadySubscriber = jest.fn();
    searchIsReady$.subscribe(searchIsReadySubscriber);
  });

  describe('searchIsReady$', () => {
    describe('search route', () => {
      it('should emit when the search route is active and search results came in', () => {
        const { dispatch } = createStore(SEARCH_PATH);
        dispatch(updateHistoryWrapped(SEARCH_PATH));
        dispatch(receiveSearchResults());
        expect(searchIsReadySubscriber).toHaveBeenCalledTimes(1);
      });

      it('should not emit when search route is active but no search results came in yet', () => {
        const { dispatch } = createStore('/somepath');
        dispatch(updateHistoryWrapped());
        expect(searchIsReadySubscriber).toHaveBeenCalledTimes(0);
      });

      it('should not emit when search results came in but the route is not active', () => {
        const { dispatch } = createStore('/somepath');
        dispatch(updateHistoryWrapped());
        dispatch(receiveSearchResults());
        expect(searchIsReadySubscriber).toHaveBeenCalledTimes(0);
      });
    });

    describe('coming back from legacy pages', () => {
      it('should emit when pwaDidAppear is dispatched and a search path is active', () => {
        const { dispatch } = createStore(SEARCH_PATH);
        dispatch(pwaDidAppear());
        expect(searchIsReadySubscriber).toHaveBeenCalledTimes(1);
      });

      it('should not emit when pwaDidAppear is dispatched and no search path is active', () => {
        const { dispatch } = createStore('/somepath');
        dispatch(pwaDidAppear());
        expect(searchIsReadySubscriber).not.toHaveBeenCalled();
      });
    });
  });
});
