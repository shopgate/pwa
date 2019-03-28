import core from '@shopgate/tracking-core/core/Core';
import { routeDidLeave$ } from '@shopgate/pwa-common/streams';
import { scanActivated$, scanFail$, scanSuccess$ } from '../streams/scanner';
import { buildScannerUtmUrl, createScannerEventData, track } from '../helpers';

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

  const afterScan$ = scanActivated$
    .withLatestFrom(routeDidLeave$)
    .switchMap(
      () => scanSuccess$.first(),
      ([activatedAction, refererAction], successAction) => ({
        activatedAction,
        refererAction,
        successAction,
        getState: activatedAction.getState,
      })
    );

  subscribe(afterScan$, ({
    activatedAction, refererAction, successAction, getState,
  }) => {
    const { action: { route: scannerRoute } = {} } = activatedAction;
    const { action: { route: { location: referer } = {} } } = refererAction;
    const { action: { format, payload } } = successAction;

    // eslint-disable-next-line extra-rules/no-single-line-objects
    const urlWithUtm = buildScannerUtmUrl({
      scannerRoute, format, payload, referer,
    });

    track('setCampaignWithUrl', {
      url: urlWithUtm,
      type: 'scanner',
    }, getState());
  });
}
