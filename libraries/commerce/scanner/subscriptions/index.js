import Scanner from '@shopgate/pwa-core/classes/Scanner';
import ScannerEventListener from '@shopgate/pwa-core/classes/ScannerEventListener';
import { SCANNER_SCOPE_DEFAULT } from '@shopgate/pwa-core/constants/Scanner';
import { appDidStart$ } from '@shopgate/pwa-common/streams';
import { scannerFinished } from '../action-creators';
import handleBarCode from '../actions/handleBarCode';
import handleQrCode from '../actions/handleQrCode';
import {
  scannerFinishedBarCode$,
  scannerFinishedQrCode$,
} from '../streams';

/**
 * Scanner subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default (subscribe) => {
  // Register global listener to convert to stream
  subscribe(appDidStart$, ({ dispatch }) => {
    Scanner.addListener(new ScannerEventListener('Scanner listener')
      .setHandler(({ scope, payload: { format, code: payload } = {} }) => {
        dispatch(scannerFinished(scope, format, payload));
      }));
  });

  // Default scope stream
  const scannerFinishedBarCodeDefault$ = scannerFinishedBarCode$
    .filter(({ action }) => action.scope === SCANNER_SCOPE_DEFAULT);

  // Default scope bar code handler
  subscribe(scannerFinishedBarCodeDefault$, ({ dispatch, action }) => {
    const { payload } = action;
    dispatch(handleBarCode(payload));
  });

  // Default scope qr code stream
  const scannerFinishedQrCodeDefault$ = scannerFinishedQrCode$
    .filter(({ action }) => action.scope === SCANNER_SCOPE_DEFAULT);

  // Default scope qr code handler
  subscribe(scannerFinishedQrCodeDefault$, ({ dispatch, action }) => {
    const { payload } = action;
    dispatch(handleQrCode(payload));
  });
};
