/* eslint-disable extra-rules/no-single-line-objects */
import Scanner from '@shopgate/pwa-core/classes/Scanner';
import ScannerEvent from '@shopgate/pwa-core/classes/ScannerEvent';
import { SCANNER_SCOPE_DEFAULT, SCANNER_TYPE_BARCODE } from '@shopgate/pwa-core/constants/Scanner';
import { appDidStart$ } from '@shopgate/pwa-common/streams';
import scannerFinished from '../action-creators/scannerFinished';
import handleBarCode from '../actions/handleBarCode';
import handleQrCode from '../actions/handleQrCode';
import subscriptions, { handledFormats } from './index';

jest.mock('@shopgate/pwa-core/classes/Scanner', () => ({
  addListener: jest.fn(),
}));
jest.mock('@shopgate/pwa-common/streams/app', () => ({
  appDidStart$: jest.fn(),
}));
jest.mock('../action-creators/scannerFinished', () => jest.fn());
jest.mock('../actions/handleBarCode');
jest.mock('../actions/handleQrCode');

describe('scanner subscriptions', () => {
  const subscribe = jest.fn();
  const dispatch = jest.fn();

  /**
   * @param {string} [format='EAN_13'] The event format.
   * @returns {ScannerEvent}
   */
  const createMockedEvent = (format = 'EAN_13') => new ScannerEvent(
    SCANNER_SCOPE_DEFAULT,
    SCANNER_TYPE_BARCODE,
    { format, code: '0000000000000' }
  );

  let appDidStartStream$;
  let appDidStartCallback;
  // eslint-disable-next-line no-unused-vars
  let scanFinishedBarCodeStream$;
  let scanFinishedBarCodeCallback;
  // eslint-disable-next-line no-unused-vars
  let scanFinishedQrCodeStream$;
  let scanFinishedQrCodeCallback;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    subscriptions(subscribe);
    [
      [appDidStartStream$, appDidStartCallback],
      [scanFinishedBarCodeStream$, scanFinishedBarCodeCallback],
      [scanFinishedQrCodeStream$, scanFinishedQrCodeCallback],
    ] = subscribe.mock.calls;
  });

  it('should init 3 subscriptions', () => {
    expect(subscribe).toHaveBeenCalledTimes(3);
  });

  describe('appDidStart subscription', () => {
    it('should init appDidStart subscription', () => {
      expect(appDidStartStream$).toEqual(appDidStart$);
      expect(appDidStartCallback).toBeInstanceOf(Function);
    });

    it('should dispatch mapped ScannerEvent action', async () => {
      appDidStartCallback({ dispatch });

      expect(Scanner.addListener).toHaveBeenCalledTimes(1);
      const [[listenerActual]] = Scanner.addListener.mock.calls;
      expect(listenerActual.handler).toBeInstanceOf(Function);

      await listenerActual.notify(createMockedEvent());
      // Expect event to be mapped to stream
      expect(scannerFinished).toBeCalledWith(SCANNER_SCOPE_DEFAULT, 'EAN_13', '0000000000000');
    });

    it('should dispatch mapped ScannerEvent action for every supported format', async () => {
      appDidStartCallback({ dispatch });
      const [[listenerActual]] = Scanner.addListener.mock.calls;

      const events = handledFormats
        .map(format => listenerActual.handler(createMockedEvent(format)));

      await Promise.all(events);

      expect(scannerFinished).toHaveBeenCalledTimes(handledFormats.length);
    });

    it('should not dispatch mapped ScannerEvent action for an unsupported format', async () => {
      appDidStartCallback({ dispatch });
      const [[listenerActual]] = Scanner.addListener.mock.calls;
      await listenerActual.notify(createMockedEvent('unknown'));

      expect(scannerFinished).not.toHaveBeenCalled();
    });
  });

  describe('scanFinishedBarCode subscription', () => {
    it('should init scanFinishedBarCode subscription', () => {
      expect(scanFinishedBarCodeCallback).toBeInstanceOf(Function);
    });

    it('should call bar code handler with bar code payload', async () => {
      const scope = SCANNER_SCOPE_DEFAULT;
      const format = 'EAN_13';
      const payload = '123456';

      scanFinishedBarCodeCallback({ dispatch, action: { scope, format, payload } });

      expect(handleBarCode).toHaveBeenCalledTimes(1);
      expect(handleBarCode).toHaveBeenCalledWith({ scope, format, payload });
    });
  });

  describe('scanFinishedQrCode subscription', () => {
    it('should init scanFinishedQrCode subscription', () => {
      expect(scanFinishedQrCodeCallback).toBeInstanceOf(Function);
    });

    it('should call qr code handler with qr code payload', async () => {
      const scope = SCANNER_SCOPE_DEFAULT;
      const format = 'QR_CODE';
      const payload = 'https://2d.is/7/30289';
      scanFinishedQrCodeCallback({ dispatch, action: { scope, format, payload } });

      expect(handleQrCode).toHaveBeenCalledTimes(1);
      expect(handleQrCode).toHaveBeenCalledWith({ scope, format, payload });
    });
  });
});
/* eslint-enable extra-rules/no-single-line-objects */
