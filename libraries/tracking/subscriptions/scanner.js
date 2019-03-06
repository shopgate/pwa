import core from '@shopgate/tracking-core/core/Core';
import { scanActivated$, scanSuccess$, scanFail$ } from '../streams/scanner';
import { track, createScannerEventData } from '../helpers';
import { SCANNER_TYPE_QR } from '../constants';

/**
 * Scanner tracking subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function scanner(subscribe) {
  const events = core.getScannerEvents();

  subscribe(scanActivated$, ({ action }) => {
    const { event: { type } = {} } = action;

    if (type === SCANNER_TYPE_QR) {
      track('qrScanner', createScannerEventData({
        event: events.SCAN_ACTIVATED,
        userInteraction: false,
        type,
      }));
    }
  });

  subscribe(scanSuccess$, ({ action }) => {
    const { event: { type, payload, url } = {} } = action;

    if (type === SCANNER_TYPE_QR) {
      track('qrScanner', createScannerEventData({
        event: events.SCAN_SUCCESS,
        type,
        payload,
        url,
      }));
    }
  });

  subscribe(scanFail$, ({ action }) => {
    const { event: { type } = {} } = action;

    if (type === SCANNER_TYPE_QR) {
      track('qrScanner', createScannerEventData({
        event: events.SCAN_FAIL,
        type,
      }));
    }
  });
}
