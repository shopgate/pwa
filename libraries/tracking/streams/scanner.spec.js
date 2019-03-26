import { mainSubject } from '@shopgate/pwa-common/store/middelwares/streams';
import { SCANNER_SCOPE_DEFAULT, SCANNER_TYPE_BARCODE } from '@shopgate/pwa-core/constants/Scanner';
import { ROUTE_DID_ENTER } from '@shopgate/pwa-common/constants/ActionTypes';
import { SUCCESS_HANDLE_SCANNER, ERROR_HANDLE_SCANNER, SCANNER_PATH } from '@shopgate/pwa-common-commerce/scanner/constants';
import { scanActivated$, scanSuccess$, scanFail$ } from './scanner';

describe('Scanner streams', () => {
  let subscriber;

  beforeEach(() => {
    subscriber = jest.fn();
  });

  describe('scanActivated$', () => {
    it('should call the subscriber when the scanner page was opened and valid query parameters are set', () => {
      scanActivated$.subscribe(subscriber);
      mainSubject.next({
        action: {
          type: ROUTE_DID_ENTER,
          route: {
            pathname: SCANNER_PATH,
            query: {
              type: SCANNER_TYPE_BARCODE,
              scope: SCANNER_SCOPE_DEFAULT,
            },
          },
        },
      });
      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it('should call the subscriber when the scanner page was opened and no query parameters are set', () => {
      scanActivated$.subscribe(subscriber);
      mainSubject.next({
        action: {
          type: ROUTE_DID_ENTER,
          route: {
            pathname: SCANNER_PATH,
            query: {},
          },
        },
      });
      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it('should not call the subscriber when the scanner page was opened but invalid query parameters are set', () => {
      scanActivated$.subscribe(subscriber);
      mainSubject.next({
        action: {
          type: ROUTE_DID_ENTER,
          route: {
            pathname: SCANNER_PATH,
            query: {
              type: 'someType',
              scope: 'someScope',
            },
          },
        },
      });
      expect(subscriber).not.toHaveBeenCalled();
    });
  });

  describe('scanSuccess$', () => {
    it('should call the subscriber when the success action is dispatched with the default scope', () => {
      scanSuccess$.subscribe(subscriber);
      mainSubject.next({
        action: {
          type: SUCCESS_HANDLE_SCANNER,
          scope: SCANNER_SCOPE_DEFAULT,
        },
      });
      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it('should not call the subscriber when the success action is dispatched with in unknown scope', () => {
      scanSuccess$.subscribe(subscriber);
      mainSubject.next({
        action: {
          type: SUCCESS_HANDLE_SCANNER,
          scope: 'unknown',
        },
      });
      expect(subscriber).not.toHaveBeenCalled();
    });
  });

  describe('scanFail$', () => {
    it('should call the subscriber when the success action is dispatched with the default scope', () => {
      scanFail$.subscribe(subscriber);
      mainSubject.next({
        action: {
          type: ERROR_HANDLE_SCANNER,
          scope: SCANNER_SCOPE_DEFAULT,
        },
      });
      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it('should not call the subscriber when the success action is dispatched with in unknown scope', () => {
      scanFail$.subscribe(subscriber);
      mainSubject.next({
        action: {
          type: ERROR_HANDLE_SCANNER,
          scope: 'unknown',
        },
      });
      expect(subscriber).not.toHaveBeenCalled();
    });
  });
});

