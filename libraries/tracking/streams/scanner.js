import { main$ } from '@shopgate/pwa-common/streams/main';
import { SCANNER_SCOPE_DEFAULT, SCANNER_TYPE_BARCODE } from '@shopgate/pwa-core/constants/Scanner';
import { scannerDidEnter$ } from '@shopgate/pwa-common-commerce/scanner/streams';
import { SUCCESS_HANDLE_SCANNER, ERROR_HANDLE_SCANNER } from '@shopgate/pwa-common-commerce/scanner/constants';

/** @type {Observable} */
export const scanActivated$ = scannerDidEnter$.filter(({ action }) => {
  const {
    route: {
      query: {
        type = SCANNER_TYPE_BARCODE,
        scope = SCANNER_SCOPE_DEFAULT,
      } = {},
    },
  } = action;

  // The stream in supposed to emit only for the Shopgate default scanner.
  return (type === SCANNER_TYPE_BARCODE && scope === SCANNER_SCOPE_DEFAULT);
});

/** @type {Observable} */
export const scanSuccess$ = main$.filter(({ action }) => {
  const { type, scope } = action;
  return type === SUCCESS_HANDLE_SCANNER && scope === SCANNER_SCOPE_DEFAULT;
});

/** @type {Observable} */
export const scanFail$ = main$.filter(({ action }) => {
  const { type, scope } = action;
  return type === ERROR_HANDLE_SCANNER && scope === SCANNER_SCOPE_DEFAULT;
});
