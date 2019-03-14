import Scanner from '@shopgate/pwa-core/classes/Scanner';
import ScannerEventListener from '@shopgate/pwa-core/classes/ScannerEventListener';
import { SCANNER_SCOPE_DEFAULT } from '@shopgate/pwa-core/constants/Scanner';
import showModal from '@shopgate/pwa-common/actions/modal/showModal';
import { historyPush } from '@shopgate/pwa-common/actions/router';
import { appDidStart$ } from '@shopgate/pwa-common/streams';
import { getProductRoute } from '../../product/helpers';
import { getSearchRoute } from '../../search/helpers';
import fetchProductsByQuery from '../../product/actions/fetchProductsByQuery';
import { scanSuccess } from '../action-creators';
import { scanSuccessBarCode$ } from '../streams';

/**
 * Scanner subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default (subscribe) => {
  // Register global listener to convert to stream
  subscribe(appDidStart$, ({ dispatch }) => {
    Scanner.addListener(new ScannerEventListener('Scanner listener')
      .setHandler(({ scope, payload: { format, code: payload } = {} }) => {
        dispatch(scanSuccess(scope, format, payload));
      }));
  });

  // Default scope
  const scanSuccessBarCodeDefault$ = scanSuccessBarCode$
    .filter(({ action }) => action.scope === SCANNER_SCOPE_DEFAULT);

  // Handle default scope
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
