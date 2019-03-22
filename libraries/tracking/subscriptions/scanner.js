import core from '@shopgate/tracking-core/core/Core';
import { scanActivated$, scanSuccess$, scanFail$ } from '../streams/scanner';
import { track, createScannerEventData } from '../helpers';

/**
 * Scanner tracking subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function scanner(subscribe) {
  const events = core.getScannerEvents();

  subscribe(scanActivated$, ({ action }) => {
    const { format } = action;
    track('qrScanner', createScannerEventData({
      event: events.SCAN_ACTIVATED,
      userInteraction: false,
      format,
    }));
  });

  subscribe(scanSuccess$, ({ action }) => {
    const { format, payload } = action;
    track('qrScanner', createScannerEventData({
      event: events.SCAN_SUCCESS,
      format,
      payload,
    }));
  });

  subscribe(scanFail$, ({ action }) => {
    const { format, payload } = action;
    track('qrScanner', createScannerEventData({
      event: events.SCAN_FAIL,
      format,
      payload,
    }));
  });
}
