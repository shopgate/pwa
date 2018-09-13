import event from '../Event';
import registerEvents from '../../commands/registerEvents';

import ScannerManager, {
  APP_EVENT_SCANNER_DID_SCAN,
  APP_EVENT_SCANNER_RESULT_PROCESSED,
  APP_EVENT_CLOSE_SCANNER,
  APP_EVENT_SCANNER_ERROR_CONFIRMED,
} from './index';

import ScanProcessingError from './ScanProcessingError';

import {
  SCANNER_MODE_ON,
  SCANNER_TYPE_BARCODE,
  SCANNER_TYPE_CARD,
  SCANNER_TYPE_IMAGE,
} from '../../constants/Scanner';

jest.mock('../Event');

const mockedBroadcastEventCmd = jest.fn();
jest.mock('../../commands/broadcastEvent', () => (...args) => mockedBroadcastEventCmd(...args));
jest.mock('../../commands/registerEvents', () => jest.fn());

const mockedOpenScannerCmd = jest.fn();
const mockedCloseScannerCmd = jest.fn();
const mockedStartScannerCmd = jest.fn();

jest.mock('../../commands/scanner', () => ({
  openScanner: (...args) => mockedOpenScannerCmd(...args),
  closeScanner: (...args) => mockedCloseScannerCmd(...args),
  startScanner: (...args) => mockedStartScannerCmd(...args),
}));

const mockErrorLogger = jest.fn();

jest.mock('../../helpers', () => ({
  logger: {
    error: (...args) => mockErrorLogger(...args),
    warn: () => () => {},
  },
}));

describe('ScannerManager', () => {
  let instance;
  const mockedScanHandler = jest.fn().mockResolvedValue();
  const eventAddCallbackSpy = event.addCallbackSpy;
  const eventRemoveCallbackSpy = event.removeCallbackSpy;

  beforeAll(() => {

  });

  beforeEach(() => {
    jest.clearAllMocks();
    instance = new ScannerManager();
    instance.registerScanHandler(mockedScanHandler);
  });

  afterEach(() => {
    // Take care the the scanner event callbacks are removed.
    event.removeAllListeners();
  });

  describe('.constructor()', () => {
    it('should register necessary only once', () => {
      expect(registerEvents).toHaveBeenCalledTimes(1);
      const newInstance = new ScannerManager();
      expect(registerEvents).toHaveBeenCalledTimes(1);
      expect(newInstance).toBeInstanceOf(ScannerManager);
    });

    it('should work as expected when no options are passed', () => {
      expect(instance.autoClose).toBe(true);
      expect(instance.supportedTypes).toEqual(expect.any(Array));
      expect(instance.supportedTypes).not.toHaveLength(0);
      expect(typeof instance.scanHandler).toBe('function');
    });

    it('should work as expected when the auto close option is passed', () => {
      instance = new ScannerManager({ autoClose: false });
      expect(instance.autoClose).toBe(false);
    });
  });

  describe('.registerScanHandler()', () => {
    it('should work as expected when a valid handler was passed', () => {
      // eslint-disable-next-line require-jsdoc
      const handler = () => {};
      const result = instance.registerScanHandler(handler);
      expect(result).toEqual(instance);
      expect(instance.scanHandler).toBe(handler);
    });

    it('should work as expected when an invalid handler was passed', () => {
      const handler = null;
      const result = instance.registerScanHandler(handler);
      expect(result).toEqual(instance);
      expect(typeof instance.scanHandler).toBe('function');
    });
  });

  describe('.openScanner()', () => {
    it('should work as expected without params', () => {
      const expectedOpenScannerParams = {
        modes: {
          [SCANNER_TYPE_BARCODE]: SCANNER_MODE_ON,
        },
      };

      const result = instance.openScanner();

      expect(result).toEqual(instance);
      expect(eventAddCallbackSpy).toHaveBeenCalledTimes(3);
      expect(eventAddCallbackSpy)
        .toHaveBeenCalledWith(APP_EVENT_CLOSE_SCANNER, instance.closeScanner);
      expect(eventAddCallbackSpy)
        .toHaveBeenCalledWith(APP_EVENT_SCANNER_DID_SCAN, instance.scannerDidScanListener);
      expect(eventAddCallbackSpy)
        .toHaveBeenCalledWith(APP_EVENT_SCANNER_ERROR_CONFIRMED, expect.any(Function));
      expect(mockedOpenScannerCmd).toHaveBeenCalledTimes(1);
      expect(mockedOpenScannerCmd).toHaveBeenCalledWith(expectedOpenScannerParams);
    });

    it('should work as expected when barcode type is passed as param', () => {
      const expectedOpenScannerParams = {
        modes: {
          [SCANNER_TYPE_BARCODE]: SCANNER_MODE_ON,
        },
      };

      const result = instance.openScanner(SCANNER_TYPE_BARCODE);

      expect(result).toEqual(instance);
      expect(eventAddCallbackSpy).toHaveBeenCalledTimes(3);
      expect(mockedOpenScannerCmd).toHaveBeenCalledTimes(1);
      expect(mockedOpenScannerCmd).toHaveBeenCalledWith(expectedOpenScannerParams);
    });

    it('should work as expected when image type is passed as param', () => {
      const expectedOpenScannerParams = {
        modes: {
          [SCANNER_TYPE_IMAGE]: SCANNER_MODE_ON,
        },
      };

      const result = instance.openScanner(SCANNER_TYPE_IMAGE);

      expect(result).toEqual(instance);
      expect(eventAddCallbackSpy).toHaveBeenCalledTimes(3);
      expect(mockedOpenScannerCmd).toHaveBeenCalledTimes(1);
      expect(mockedOpenScannerCmd).toHaveBeenCalledWith(expectedOpenScannerParams);
    });

    it('should log an error when an unsupported param is passed', () => {
      const result = instance.openScanner(SCANNER_TYPE_CARD);

      expect(result).toEqual(instance);
      expect(mockErrorLogger).toHaveBeenCalledTimes(1);
      expect(eventAddCallbackSpy).toHaveBeenCalledTimes(0);
      expect(mockedOpenScannerCmd).toHaveBeenCalledTimes(0);
    });
  });

  describe('.closeScanner()', () => {
    it('should work as expected', () => {
      const result = instance.closeScanner();

      expect(result).toEqual(instance);
      expect(eventRemoveCallbackSpy).toHaveBeenCalledTimes(3);
      expect(eventRemoveCallbackSpy)
        .toHaveBeenCalledWith(APP_EVENT_CLOSE_SCANNER, instance.closeScanner);
      expect(eventRemoveCallbackSpy)
        .toHaveBeenCalledWith(APP_EVENT_SCANNER_DID_SCAN, instance.scannerDidScanListener);
      expect(eventRemoveCallbackSpy)
        .toHaveBeenCalledWith(APP_EVENT_SCANNER_ERROR_CONFIRMED, expect.any(Function));
      expect(mockedCloseScannerCmd).toHaveBeenCalledTimes(1);
    });
  });

  describe('.scannerDidScanListener()', () => {
    const requestId = 'abc123';
    let mockedCloseScanner;

    beforeEach(() => {
      // Create a new instance without a default handler for the following tests.
      instance = new ScannerManager();
      mockedCloseScanner = jest.spyOn(instance, 'closeScanner');
    });

    it('should close the scanner when the handler does not throw an error', async () => {
      // eslint-disable-next-line require-jsdoc
      const handler = async () => {};
      instance.registerScanHandler(handler);
      await instance.scannerDidScanListener({ requestId });

      expect(mockedCloseScanner).toHaveBeenCalledTimes(1);
      expect(mockedBroadcastEventCmd).toHaveBeenCalledTimes(1);
      expect(mockedBroadcastEventCmd).toHaveBeenLastCalledWith({
        event: APP_EVENT_SCANNER_RESULT_PROCESSED,
        parameters: [requestId, true, null],
      });
    });

    it('should not close the scanner when the handler when autoClose is turned off', async () => {
      instance.autoClose = false;
      await instance.scannerDidScanListener({ requestId });

      expect(mockedCloseScanner).toHaveBeenCalledTimes(0);
      expect(mockedBroadcastEventCmd).toHaveBeenCalledTimes(1);
      expect(mockedBroadcastEventCmd).toHaveBeenLastCalledWith({
        event: APP_EVENT_SCANNER_RESULT_PROCESSED,
        parameters: [requestId, true, null],
      });
    });

    it('should close the scanner when no scan handler was set', async () => {
      await instance.scannerDidScanListener({ requestId });

      expect(mockedCloseScanner).toHaveBeenCalledTimes(1);
      expect(mockedBroadcastEventCmd).toHaveBeenCalledTimes(1);
      expect(mockedBroadcastEventCmd).toHaveBeenLastCalledWith({
        event: APP_EVENT_SCANNER_RESULT_PROCESSED,
        parameters: [requestId, true, null],
      });
    });

    it('should dispatch a scanner error to the scanner view when the handler throws an error', async () => {
      const title = 'Error Title';
      const message = 'Message';
      const handler = jest.fn(async () => {
        throw new ScanProcessingError(message, title);
      });
      instance.registerScanHandler(handler);
      await instance.scannerDidScanListener({ requestId });

      expect(mockedCloseScanner).toHaveBeenCalledTimes(0);
      expect(mockedBroadcastEventCmd).toHaveBeenCalledTimes(1);
      expect(mockedBroadcastEventCmd).toHaveBeenLastCalledWith({
        event: APP_EVENT_SCANNER_RESULT_PROCESSED,
        parameters: [requestId, false, {
          message,
          title,
        }],
      });
    });

    it('should dispatch a scanner error without title to the scanner view when the handler throws an error', async () => {
      const message = 'Message';
      const handler = jest.fn(async () => {
        throw new Error(message);
      });
      instance.registerScanHandler(handler);
      await instance.scannerDidScanListener({ requestId });

      expect(mockedCloseScanner).toHaveBeenCalledTimes(0);
      expect(mockedBroadcastEventCmd).toHaveBeenCalledTimes(1);
      expect(mockedBroadcastEventCmd).toHaveBeenLastCalledWith({
        event: APP_EVENT_SCANNER_RESULT_PROCESSED,
        parameters: [requestId, false, {
          message,
          title: null,
        }],
      });
    });

    it('should format the scannerDidScan payload like expected for barcode scans', async () => {
      const code = '4004764315772';
      const format = 'EAN_13';

      const scanPayload = {
        scannerType: SCANNER_TYPE_BARCODE,
        requestId,
        format,
        code,
      };

      const handler = jest.fn();
      instance.registerScanHandler(handler);
      await instance.scannerDidScanListener(scanPayload);
      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith({
        scannerType: SCANNER_TYPE_BARCODE,
        requestId,
        data: {
          code,
          format,
        },
      });
    });

    it('should format the scannerDidScan payload like expected for image scans', async () => {
      const format = 'jpg';
      const imageData = 'abc123';

      const scanPayload = {
        scannerType: SCANNER_TYPE_BARCODE,
        requestId,
        imageData,
        format,
      };

      const handler = jest.fn();
      instance.registerScanHandler(handler);
      await instance.scannerDidScanListener(scanPayload);
      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith({
        scannerType: SCANNER_TYPE_BARCODE,
        requestId,
        data: {
          imageData,
          format,
        },
      });
    });
  });

  describe('App event handling', () => {
    describe('closeScanner', () => {
      it('should work as expected', () => {
        // Trigger when no listener is present - no close command call.
        event.call(APP_EVENT_CLOSE_SCANNER);
        instance.openScanner();
        // Trigger when the listener is present - one close command call.
        event.call(APP_EVENT_CLOSE_SCANNER);
        // Remove the listener - one close command call.
        instance.closeScanner();
        // Trigger again without an active listener - no close command call.
        event.call(APP_EVENT_CLOSE_SCANNER);

        expect(mockedCloseScannerCmd).toHaveBeenCalledTimes(2);
      });
    });

    describe('scannerDidScan', () => {
      it('should work as expected', () => {
        const code = '4004764315772';
        const format = 'EAN_13';

        const scanPayload = {
          requestId: 0,
          scannerType: SCANNER_TYPE_BARCODE,
          code,
          format,
        };

        // Trigger when no listener is present - no method call.
        event.call(APP_EVENT_SCANNER_DID_SCAN, [{
          ...scanPayload,
          requestId: `${scanPayload.requestId += 1}`,
        }]);
        instance.openScanner();
        // Trigger when the listener is present - one method call.
        event.call(APP_EVENT_SCANNER_DID_SCAN, [{
          ...scanPayload,
          requestId: `${scanPayload.requestId += 1}`,
        }]);
        // Remove the listener.
        instance.closeScanner();
        // Trigger again without an active listener - no method call.
        event.call(APP_EVENT_SCANNER_DID_SCAN, [{
          ...scanPayload,
          requestId: `${scanPayload.requestId += 1}`,
        }]);

        expect(mockedScanHandler).toHaveBeenCalledTimes(1);
        expect(mockedScanHandler).toHaveBeenCalledWith({
          scannerType: SCANNER_TYPE_BARCODE,
          requestId: '2',
          data: {
            code,
            format,
          },
        });
      });
    });

    describe('scannerErrorConfirmed', () => {
      it('should work as expected', () => {
        // Trigger when no listener is present - no command call.
        event.call(APP_EVENT_SCANNER_ERROR_CONFIRMED);
        instance.openScanner();
        // Trigger when the listener is present - one command call.
        event.call(APP_EVENT_SCANNER_ERROR_CONFIRMED);
        // Remove the listener.
        instance.closeScanner();
        // Trigger again without an active listener - no command call.
        event.call(APP_EVENT_SCANNER_ERROR_CONFIRMED);

        expect(mockedStartScannerCmd).toHaveBeenCalledTimes(1);
      });
    });
  });
});
