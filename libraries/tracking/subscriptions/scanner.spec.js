/* eslint-disable extra-rules/no-single-line-objects */
import core from '@shopgate/tracking-core/core/Core';
import { scanActivated$, scanSuccess$, scanFail$ } from '../streams/scanner';
import * as helpers from '../helpers';
import subscription from './scanner';

const { createScannerEventData } = helpers;
const scannerEvents = core.getScannerEvents();

describe('Scanner subscriptions', () => {
  const subscribe = jest.fn();
  const trackSpy = jest.spyOn(helpers, 'track');

  const format = 'QR_CODE';
  const payload = 'some.payload';

  beforeEach(() => {
    jest.clearAllMocks();
    subscription(subscribe);
  });

  it('should call subscribe as expected', () => {
    expect(subscribe).toHaveBeenCalledTimes(3);
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
      callback({ action: { format } });
      expect(trackSpy).toHaveBeenCalledWith('qrScanner', createScannerEventData({
        event: scannerEvents.SCAN_ACTIVATED,
        userInteraction: false,
        format,
      }));
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
      callback({ action: { format, payload } });
      expect(trackSpy).toHaveBeenCalledWith('qrScanner', createScannerEventData({
        event: scannerEvents.SCAN_SUCCESS,
        format,
        payload,
      }));
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
      callback({ action: { format, payload } });
      expect(trackSpy).toHaveBeenCalledWith('qrScanner', createScannerEventData({
        event: scannerEvents.SCAN_FAIL,
        format,
        payload,
      }));
    });
  });
});

/* eslint-enable extra-rules/no-single-line-objects */
