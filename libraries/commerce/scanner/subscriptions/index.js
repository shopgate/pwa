import Scanner from '@shopgate/pwa-core/classes/Scanner';
import ScannerEventListener from '@shopgate/pwa-core/classes/ScannerEventListener';
import { SCANNER_SCOPE_DEFAULT } from '@shopgate/pwa-core/constants/Scanner';
import { appDidStart$ } from '@shopgate/pwa-common/streams';
import scannerFinished from '../action-creators/scannerFinished';
import handleBarCode from '../actions/handleBarCode';
import handleQrCode from '../actions/handleQrCode';
import { SCANNER_FORMATS_BARCODE, SCANNER_FORMATS_QR_CODE } from '../constants';
import {
  scannerFinishedBarCode$,
  scannerFinishedQrCode$,
} from '../streams';

// Scanner payload formats which are handled by the subscriptions.
export const handledFormats = [...SCANNER_FORMATS_BARCODE, ...SCANNER_FORMATS_QR_CODE];

/**
 * Scanner subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default (subscribe) => {
  // Register global listener to convert to stream
  subscribe(appDidStart$, ({ dispatch }) => {
    Scanner.addListener(new ScannerEventListener('Scanner listener', null, null, handledFormats)
      .setHandler(({ scope, payload: { format, code: payload } = {} }) => {
        dispatch(scannerFinished(scope, format, payload));
      }));
  });

  // Default scope stream
  const scannerFinishedBarCodeDefault$ = scannerFinishedBarCode$
    .filter(({ action }) => action.scope === SCANNER_SCOPE_DEFAULT);

  // Default scope bar code handler
  subscribe(scannerFinishedBarCodeDefault$, ({ dispatch, action }) => {
    const { scope, format, payload } = action;
    dispatch(handleBarCode({
      scope,
      format,
      payload,
    }));
  });

  // Default scope qr code stream
  const scannerFinishedQrCodeDefault$ = scannerFinishedQrCode$
    .filter(({ action }) => action.scope === SCANNER_SCOPE_DEFAULT);

  // Default scope qr code handler
  subscribe(scannerFinishedQrCodeDefault$, ({ dispatch, action }) => {
    const { scope, format, payload } = action;
    dispatch(handleQrCode({
      scope,
      format,
      payload,
    }));
  });
};
