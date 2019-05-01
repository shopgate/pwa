import { main$ } from '@shopgate/pwa-common/streams/main';
import { routeDidEnter$ } from '@shopgate/pwa-common/streams/router';
import {
  START_SCANNER,
  SCANNER_STARTED,
  SCANNER_CANCELLED,
  SCANNER_FINISHED,
  SCANNER_PATH,
  SCANNER_FORMATS_BARCODE,
  SCANNER_FORMATS_QR_CODE,
} from '../constants';

/** @type {Observable} */
export const scannerDidEnter$ = routeDidEnter$
  .filter(({ action }) => action.route.pathname === SCANNER_PATH);

export const startScanner$ = main$
  .filter(({ action }) => action.type === START_SCANNER);

/** @type {Observable} */
export const scannerStarted$ = main$
  .filter(({ action }) => action.type === SCANNER_STARTED);

/** @type {Observable} */
export const scannerCancelled$ = main$
  .filter(({ action }) => action.type === SCANNER_CANCELLED);

/** @type {Observable} */
export const scannerFinished$ = main$
  .filter(({ action }) => action.type === SCANNER_FINISHED);

/** @type {Observable} */
export const scannerFinishedBarCode$ = scannerFinished$
  .filter(({ action }) => SCANNER_FORMATS_BARCODE.includes(action.format));

/** @type {Observable} */
export const scannerFinishedQrCode$ = scannerFinished$
  .filter(({ action }) => SCANNER_FORMATS_QR_CODE.includes(action.format));
