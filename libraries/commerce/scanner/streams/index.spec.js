/* eslint-disable extra-rules/no-single-line-objects */
import { mainSubject } from '@shopgate/pwa-common/store/middelwares/streams';
import { ROUTE_DID_ENTER } from '@shopgate/pwa-common/constants/ActionTypes';
import {
  scannerDidEnter$,
  startScanner$,
  scannerStarted$,
  scannerCancelled$,
  scannerFinished$,
  scannerFinishedBarCode$,
  scannerFinishedQrCode$,
} from './index';
import {
  START_SCANNER,
  SCANNER_CANCELLED,
  SCANNER_FINISHED,
  SCANNER_STARTED,
  SCANNER_PATH,
  SCANNER_FORMATS_BARCODE,
  SCANNER_FORMATS_QR_CODE,
} from '../constants';

describe('scanner streams', () => {
  let subscriber;

  beforeEach(() => {
    subscriber = jest.fn();
  });

  it('should call subscriber when the scanner page was opened', () => {
    scannerDidEnter$.subscribe(subscriber);
    mainSubject.next({ action: { type: ROUTE_DID_ENTER, route: { pathname: SCANNER_PATH } } });
    expect(subscriber).toHaveBeenCalledTimes(1);
  });

  it('should call subscriber on start scanner event', () => {
    startScanner$.subscribe(subscriber);
    mainSubject.next({ action: { type: START_SCANNER } });
    expect(subscriber).toHaveBeenCalledTimes(1);
  });

  it('should call subscriber on scanner start event', () => {
    scannerStarted$.subscribe(subscriber);
    mainSubject.next({ action: { type: SCANNER_STARTED } });
    expect(subscriber).toHaveBeenCalledTimes(1);
  });

  it('should call subscriber on scanner cancelled event', () => {
    scannerCancelled$.subscribe(subscriber);
    mainSubject.next({ action: { type: SCANNER_CANCELLED } });
    expect(subscriber).toHaveBeenCalledTimes(1);
  });

  it('should call subscriber on scanner finished event', () => {
    scannerFinished$.subscribe(subscriber);
    mainSubject.next({ action: { type: SCANNER_FINISHED } });
    expect(subscriber).toHaveBeenCalledTimes(1);
  });

  it('should call subscriber on bar code finished event', () => {
    scannerFinished$.subscribe(subscriber);
    scannerFinishedBarCode$.subscribe(subscriber);
    mainSubject.next({ action: { type: SCANNER_FINISHED, format: SCANNER_FORMATS_BARCODE[0] } });
    expect(subscriber).toHaveBeenCalledTimes(2);
  });

  it('should call subscriber on qr code finished event', () => {
    scannerFinished$.subscribe(subscriber);
    scannerFinishedQrCode$.subscribe(subscriber);
    mainSubject.next({ action: { type: SCANNER_FINISHED, format: SCANNER_FORMATS_QR_CODE[0] } });
    expect(subscriber).toHaveBeenCalledTimes(2);
  });
});
/* eslint-enable extra-rules/no-single-line-objects */
