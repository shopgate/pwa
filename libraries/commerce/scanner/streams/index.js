import { main$ } from '@shopgate/pwa-common/streams/main';
import { SCANNER_FORMATS_BARCODE, SCANNER_FORMATS_QR_CODE } from '@shopgate/pwa-core/constants/Scanner';
import { SCANNER_SUCCESS } from '../constants';

/** @type {Observable} */
export const scanSuccess$ = main$
  .filter(({ action }) => action.type === SCANNER_SUCCESS);

/** @type {Observable} */
export const scanSuccessBarCode$ = scanSuccess$
  .filter(({ action }) => SCANNER_FORMATS_BARCODE.includes(action.format));

/** @type {Observable} */
export const scanSuccessQrCode$ = scanSuccess$
  .filter(({ action }) => SCANNER_FORMATS_QR_CODE.includes(action.format));
