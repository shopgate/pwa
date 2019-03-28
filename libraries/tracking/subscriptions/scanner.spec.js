/* eslint-disable extra-rules/no-single-line-objects */
import core from '@shopgate/tracking-core/core/Core';
import { mainSubject } from '@shopgate/pwa-common/store/middelwares/streams';
import { ROUTE_DID_ENTER, ROUTE_DID_LEAVE } from '@shopgate/pwa-common/constants/ActionTypes';
import { SCANNER_SCOPE_DEFAULT } from '@shopgate/pwa-core/constants/Scanner';
import { SCANNER_PATH, SUCCESS_HANDLE_SCANNER } from '@shopgate/pwa-common-commerce/scanner/constants';
import { scanActivated$, scanFail$, scanSuccess$ } from '../streams/scanner';
import * as helpers from '../helpers';
import subscription from './scanner';

const { createScannerEventData } = helpers;
const scannerEvents = core.getScannerEvents();

describe('Scanner subscriptions', () => {
  const mockedState = {};
  const subscribe = jest.fn();
  const getState = jest.fn().mockReturnValue(mockedState);
  const trackSpy = jest.spyOn(helpers, 'track');

  const format = 'QR_CODE';
  const payload = 'some.payload';

  beforeEach(() => {
    jest.clearAllMocks();
    subscription(subscribe);
  });

  it('should call subscribe as expected', () => {
    expect(subscribe).toHaveBeenCalledTimes(4);
  });

  describe('scanActivated$', () => {
    let stream;
    let callback;

    beforeAll(() => {
      [[stream, callback]] = subscribe.mock.calls;
    });

    it('should subscribe the the correct stream', () => {
      expect(stream).toBe(scanActivated$);
    });

    it('should call the track function', () => {
      callback({ action: { format }, getState });
      expect(trackSpy).toHaveBeenCalledWith('qrScanner', createScannerEventData({
        event: scannerEvents.SCAN_ACTIVATED,
        userInteraction: false,
        format,
      }), mockedState);
    });
  });

  describe('scanSuccess$', () => {
    let stream;
    let callback;

    beforeAll(() => {
      [, [stream, callback]] = subscribe.mock.calls;
    });

    it('should subscribe the the correct stream', () => {
      expect(stream).toBe(scanSuccess$);
    });

    it('should call the track function', () => {
      callback({ action: { format, payload }, getState });
      expect(trackSpy).toHaveBeenCalledWith('qrScanner', createScannerEventData({
        event: scannerEvents.SCAN_SUCCESS,
        format,
        payload,
      }), mockedState);
    });
  });

  describe('scanFail$', () => {
    let stream;
    let callback;

    beforeAll(() => {
      [,, [stream, callback]] = subscribe.mock.calls;
    });

    it('should subscribe the the correct stream', () => {
      expect(stream).toBe(scanFail$);
    });

    it('should call the track function', () => {
      callback({ action: { format, payload }, getState });
      expect(trackSpy).toHaveBeenCalledWith('qrScanner', createScannerEventData({
        event: scannerEvents.SCAN_FAIL,
        format,
        payload,
      }), mockedState);
    });
  });

  describe('afterScan$ UTM params', () => {
    const refererAction = {
      action: { type: ROUTE_DID_LEAVE, route: { pathname: '/', location: '/' } },
      getState,
    };
    const activatedAction = {
      action: { type: ROUTE_DID_ENTER, route: { pathname: SCANNER_PATH, location: SCANNER_PATH } },
      getState,
    };
    const successAction = {
      action: { type: SUCCESS_HANDLE_SCANNER, scope: SCANNER_SCOPE_DEFAULT },
      getState,
    };

    let afterScan$;
    let callback;

    beforeAll(() => {
      [,,, [afterScan$, callback]] = subscribe.mock.calls;
    });

    it('should call subscriber with both actions', () => {
      const subscriber = jest.fn();
      afterScan$.subscribe(subscriber);

      mainSubject.next(refererAction); // route did leave
      mainSubject.next(activatedAction); // route did enter
      mainSubject.next(successAction); // scan is handled

      expect(subscriber).toBeCalledTimes(1);
      expect(subscriber).toBeCalledWith({
        activatedAction,
        refererAction,
        successAction,
        getState,
      });
    });

    it('should call the track function', () => {
      // eslint-disable-next-line object-curly-newline
      callback({ activatedAction, refererAction, successAction, getState });
      expect(trackSpy).toHaveBeenCalledWith('setCampaignWithUrl', {
        type: 'scanner',
        url: '/scanner?utm_source=shopgate&utm_medium=scanner&utm_campaign=30177Scanner&utm_content=%2F',
      }, mockedState);
    });
  });
});

/* eslint-enable extra-rules/no-single-line-objects */
