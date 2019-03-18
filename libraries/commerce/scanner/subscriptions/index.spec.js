/* eslint-disable extra-rules/no-single-line-objects */
import Scanner from '@shopgate/pwa-core/classes/Scanner';
import ScannerEvent from '@shopgate/pwa-core/classes/ScannerEvent';
import { SCANNER_SCOPE_DEFAULT, SCANNER_TYPE_BARCODE } from '@shopgate/pwa-core/constants/Scanner';
import { appDidStart$ } from '@shopgate/pwa-common/streams';
import { scannerFinished } from '../action-creators';
import handleBarCode from '../actions/handleBarCode';
import handleQrCode from '../actions/handleQrCode';
import subscriptions from './index';

jest.mock('@shopgate/pwa-core/classes/Scanner', () => ({
  addListener: jest.fn(),
}));
jest.mock('@shopgate/pwa-common/streams/app', () => ({
  appDidStart$: jest.fn(),
}));
jest.mock('../action-creators', () => ({
  scannerFinished: jest.fn(),
}));
jest.mock('../actions/handleBarCode');
jest.mock('../actions/handleQrCode');

describe('scanner subscriptions', () => {
  const subscribe = jest.fn();
  const dispatch = jest.fn();

  // Event from scanner
  const mockedEvent = new ScannerEvent(
    SCANNER_SCOPE_DEFAULT,
    SCANNER_TYPE_BARCODE,
    { format: 'EAN_13', code: '0000000000000' }
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

    it('should dispatch mapped ScannerEvent action', () => {
      appDidStartCallback({ dispatch });

      expect(Scanner.addListener).toHaveBeenCalledTimes(1);
      const [[listenerActual]] = Scanner.addListener.mock.calls;
      expect(listenerActual.handler).toBeInstanceOf(Function);

      listenerActual.handler(mockedEvent);
      // Expect event to be mapped to stream
      expect(scannerFinished).toBeCalledWith(SCANNER_SCOPE_DEFAULT, 'EAN_13', '0000000000000');
    });
  });

  describe('scanFinishedBarCode subscription', () => {
    it('should init scanFinishedBarCode subscription', () => {
      expect(scanFinishedBarCodeCallback).toBeInstanceOf(Function);
    });

    it('should call bar code handler with bar code payload', async () => {
      scanFinishedBarCodeCallback({ dispatch, action: { payload: '123456' } });

      expect(handleBarCode).toHaveBeenCalledTimes(1);
      expect(handleBarCode).toHaveBeenCalledWith('123456');
    });
  });

  describe('scanFinishedQrCode subscription', () => {
    it('should init scanFinishedQrCode subscription', () => {
      expect(scanFinishedQrCodeCallback).toBeInstanceOf(Function);
    });

    it('should call qr code handler with qr code payload', async () => {
      scanFinishedQrCodeCallback({ dispatch, action: { payload: 'https://2d.is/7/30289' } });

      expect(handleQrCode).toHaveBeenCalledTimes(1);
      expect(handleQrCode).toHaveBeenCalledWith('https://2d.is/7/30289');
    });
  });
});
/* eslint-enable extra-rules/no-single-line-objects */
