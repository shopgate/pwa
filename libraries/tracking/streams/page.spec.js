import { mainSubject } from '@shopgate/pwa-common/store/middelwares/streams';
import { getCurrentRoute } from '@shopgate/pwa-common/selectors/router';
import {
  ROUTE_DID_ENTER,
  PWA_DID_APPEAR,
  RECEIVE_PAGE_CONFIG,
} from '@shopgate/pwa-common/constants/ActionTypes';
import { PAGE_PATTERN, getPageConfigById } from '@shopgate/engage/page';
import { pageIsReady$ } from './page';

jest.mock('@shopgate/engage/core', () => {
  const {
    main$, routeDidEnter$, pwaDidAppear$,
  } = require.requireActual('@shopgate/engage/core');

  return {
    main$,
    routeDidEnter$,
    pwaDidAppear$,
  };
});

jest.mock('@shopgate/engage/page', () => {
  const {
    PAGE_PATTERN: PAGE_PATTERN_ORIGINAL,
  } = require.requireActual('@shopgate/engage/page');

  return {
    PAGE_PATTERN: PAGE_PATTERN_ORIGINAL,
    getPageConfigById: jest.fn(),
  };
});

jest.mock('@shopgate/pwa-common/selectors/router', () => {
  const actual = require.requireActual('@shopgate/pwa-common/selectors/router');
  return {
    ...actual,
    getCurrentRoute: jest.fn(),
  };
});

const pageConfig = {
  isFetching: false,
  name: 'Some Page Name',
};

const pageRoute = {
  pattern: PAGE_PATTERN,
};

const pageId = 'page-id';

describe('Page streams', () => {
  let subscriber;
  const getState = jest.fn().mockReturnValue({});

  beforeAll(() => {
    getPageConfigById.mockReturnValue(pageConfig);
    getCurrentRoute.mockReturnValue(pageRoute);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    subscriber = jest.fn();
  });

  describe('pageIsReady$', () => {
    let subscription;

    afterEach(() => {
      subscription.unsubscribe();
    });

    describe('page route', () => {
      const routeDidEnterPayload = {
        action: {
          type: ROUTE_DID_ENTER,
          route: {
            pattern: PAGE_PATTERN,
            params: { pageId },
          },
        },
        getState,
      };

      it('should emit when a page is already available within the store', () => {
        subscription = pageIsReady$.subscribe(subscriber);
        mainSubject.next(routeDidEnterPayload);

        expect(subscriber).toHaveBeenCalledTimes(1);
        expect(subscriber).toHaveBeenCalledWith(routeDidEnterPayload);
        expect(getPageConfigById).toHaveBeenCalledTimes(1);
        expect(getPageConfigById).toHaveBeenCalledWith({}, { pageId });
      });

      it('should not emit when a page is already available within the store, but it is fetching', () => {
        getPageConfigById.mockReturnValueOnce({
          ...pageConfig,
          isFetching: true,
        });

        subscription = pageIsReady$.subscribe(subscriber);
        mainSubject.next(routeDidEnterPayload);

        expect(subscriber).not.toHaveBeenCalled();
        expect(getPageConfigById).toHaveBeenCalledTimes(1);
        expect(getPageConfigById).toHaveBeenCalledWith({}, { pageId });
      });

      it('should emit after the page config comes available', () => {
        getPageConfigById.mockReturnValueOnce(null);

        subscription = pageIsReady$.subscribe(subscriber);
        mainSubject.next(routeDidEnterPayload);
        expect(subscriber).not.toHaveBeenCalled();
        expect(getPageConfigById).toHaveBeenCalledTimes(1);
        expect(getPageConfigById).toHaveBeenCalledWith({}, { pageId });

        mainSubject.next({ action: { type: RECEIVE_PAGE_CONFIG } });

        expect(subscriber).toHaveBeenCalledTimes(1);
        expect(subscriber).toHaveBeenCalledWith(routeDidEnterPayload);
        expect(getPageConfigById).toHaveBeenCalledTimes(1);
      });
    });

    describe('navigating back from legacy pages', () => {
      it('should emit when pwaDidAppear is dispatched and a page route is active', () => {
        subscription = pageIsReady$.subscribe(subscriber);
        mainSubject.next({
          action: { type: PWA_DID_APPEAR },
          getState,
        });
        expect(subscriber).toHaveBeenCalledTimes(1);
      });

      it('should not emit when pwaDidAppear is dispatched and no page route is active', () => {
        getCurrentRoute.mockReturnValueOnce({ pattern: '/some/:pattern' });
        subscription = pageIsReady$.subscribe(subscriber);
        mainSubject.next({
          action: { type: PWA_DID_APPEAR },
          getState,
        });
        expect(subscriber).not.toHaveBeenCalled();
      });
    });
  });
});
