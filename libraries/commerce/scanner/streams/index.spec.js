/* eslint-disable extra-rules/no-single-line-objects */
import { mainSubject } from '@shopgate/pwa-common/store/middelwares/streams';
import {
  SCANNER_FORMATS_BARCODE,
  SCANNER_FORMATS_QR_CODE,
} from '@shopgate/pwa-core/constants/Scanner';
import {
  scannerStarted$,
  scannerCancelled$,
  scannerFinished$,
  scannerFinishedBarCode$,
  scannerFinishedQrCode$,
} from './index';
import { SCANNER_CANCELLED, SCANNER_FINISHED, SCANNER_STARTED } from '../constants';

describe('scanner streams', () => {
  let subscriber;

  beforeEach(() => {
    subscriber = jest.fn();
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
