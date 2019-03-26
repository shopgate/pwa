import core from '@shopgate/tracking-core/core/Core';
import { scanActivated$, scanFail$, scanSuccess$ } from '../streams/scanner';
import { createScannerEventData, track } from '../helpers';

/**
 * Scanner tracking subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function scanner(subscribe) {
  const events = core.getScannerEvents();

  subscribe(scanActivated$, ({ action, getState }) => {
    const { format } = action;
    track('qrScanner', createScannerEventData({
      event: events.SCAN_ACTIVATED,
      userInteraction: false,
      format,
    }), getState());
  });

  subscribe(scanSuccess$, ({ action, getState }) => {
    const { format, payload } = action;
    track('qrScanner', createScannerEventData({
      event: events.SCAN_SUCCESS,
      format,
      payload,
    }), getState());
  });

  subscribe(scanFail$, ({ action, getState }) => {
    const { format, payload } = action;
    track('qrScanner', createScannerEventData({
      event: events.SCAN_FAIL,
      format,
      payload,
    }), getState());
  });
}
