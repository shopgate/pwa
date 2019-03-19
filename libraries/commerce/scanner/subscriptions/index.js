import Scanner from '@shopgate/pwa-core/classes/Scanner';
import ScannerEventListener from '@shopgate/pwa-core/classes/ScannerEventListener';
import { SCANNER_SCOPE_DEFAULT } from '@shopgate/pwa-core/constants/Scanner';
import showModal from '@shopgate/pwa-common/actions/modal/showModal';
import { historyPush } from '@shopgate/pwa-common/actions/router';
import { appDidStart$ } from '@shopgate/pwa-common/streams';
import { getProductRoute } from '@shopgate/pwa-common-commerce/product/helpers';
import { getSearchRoute } from '@shopgate/pwa-common-commerce/search/helpers';
import fetchProductsByQuery from '@shopgate/pwa-common-commerce/product/actions/fetchProductsByQuery';
import { scannerFinished } from '../action-creators';
import { scannerFinishedBarCode$ } from '../streams';

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
  const scanSuccessBarCodeDefault$ = scannerFinishedBarCode$
    .filter(({ action }) => action.scope === SCANNER_SCOPE_DEFAULT);

  // Default scope handler
  subscribe(scanSuccessBarCodeDefault$, ({ dispatch, action }) => {
    const { payload } = action;

    return /* jest */ dispatch(fetchProductsByQuery(2, payload))
      .then(({ totalProductCount, products }) => {
        if (!totalProductCount) {
          dispatch(showModal({
            confirm: null,
            title: 'category.no_result.heading',
            message: 'category.no_result.body',
          })).then(() => Scanner.start()); // Continue scanning
        } else if (Number(totalProductCount) === 1) {
          dispatch(historyPush({
            pathname: getProductRoute(products[0].id),
          }));
        } else {
          dispatch(historyPush({
            pathname: getSearchRoute(payload),
          }));
        }
      });
  });
};
