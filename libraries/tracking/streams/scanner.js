import { main$ } from '@shopgate/pwa-common/streams/main';

const SCAN_ACTIVATED = 'SCAN_ACTIVATED';
const SCAN_SUCCESS = 'SCAN_SUCCESS';
const SCAN_FAIL = 'SCAN_FAIL';

export const scanActivated$ = main$.filter(({ action }) => action.type === SCAN_ACTIVATED);
export const scanSuccess$ = main$.filter(({ action }) => action.type === SCAN_SUCCESS);
export const scanFail$ = main$.filter(({ action }) => action.type === SCAN_FAIL);
