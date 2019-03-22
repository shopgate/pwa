import showModal from '@shopgate/pwa-common/actions/modal/showModal';
import Scanner from '@shopgate/pwa-core/classes/Scanner';
import { historyReplace } from '@shopgate/pwa-common/actions/router';
import fetchProductsByQuery from '@shopgate/pwa-common-commerce/product/actions/fetchProductsByQuery';
import { getProductRoute } from '@shopgate/pwa-common-commerce/product/helpers';
import { getSearchRoute } from '@shopgate/pwa-common-commerce/search/helpers';
import successHandleScanner from '../action-creators/successHandleScanner';
import errorHandleScanner from '../action-creators/errorHandleScanner';

/**
 * Handle bar code
 * @param {string} scope Scanner scope.
 * @param {string} format Format of the scanned code.
 * @param {string} payload Barcode payload.
 * @return {Function} A redux thunk.
 */
export default ({ scope, format, payload }) => async (dispatch) => {
  const {
    totalProductCount,
    products,
  } = await dispatch(fetchProductsByQuery(2, payload));

  if (!totalProductCount) {
    dispatch(errorHandleScanner(scope, format, payload));
    dispatch(showModal({
      dismiss: null,
      confirm: 'modal.ok',
      title: 'modal.title_error',
      message: 'scanner.noResult.barCode',
    })).then(confirmed => confirmed && Scanner.start());
  } else if (Number(totalProductCount) === 1) {
    dispatch(successHandleScanner(scope, format, payload));
    dispatch(historyReplace({
      pathname: getProductRoute(products[0].id),
    }));
  } else {
    dispatch(successHandleScanner(scope, format, payload));
    dispatch(historyReplace({
      pathname: getSearchRoute(payload),
    }));
  }
};

