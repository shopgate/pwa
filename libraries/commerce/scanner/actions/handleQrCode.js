import Scanner from '@shopgate/pwa-core/classes/Scanner';
import { historyPop, historyReplace } from '@shopgate/pwa-common/actions/router';
import { fetchPageConfig } from '@shopgate/pwa-common/actions/page';
import { getPageConfigById } from '@shopgate/pwa-common/selectors/page';
import showModal from '@shopgate/pwa-common/actions/modal/showModal';
import { fetchProductsById, getProductById } from '@shopgate/pwa-common-commerce/product';
import { fetchCategory, getCategoryById } from '@shopgate/pwa-common-commerce/category';
import successHandleScanner from '../action-creators/successHandleScanner';
import errorHandleScanner from '../action-creators/errorHandleScanner';
import {
  QR_CODE_TYPE_CATEGORY,
  QR_CODE_TYPE_COUPON,
  QR_CODE_TYPE_HOMEPAGE,
  QR_CODE_TYPE_PAGE,
  QR_CODE_TYPE_PRODUCT,
  QR_CODE_TYPE_PRODUCT_WITH_COUPON,
  QR_CODE_TYPE_SEARCH,
} from '../constants';
import { parse2dsQrCode } from '../helpers';

/**
 * Handle qr code
 * @param {string} scope Scanner scope.
 * @param {string} format Format of the scanned code.
 * @param {string} payload Barcode payload.
 * @return {Function} A redux thunk.
 */
export default ({ scope, format, payload }) => async (dispatch, getState) => {
  const { type, link, data } = parse2dsQrCode(payload) || {};

  /** Show modal and continue scanning */
  const notFound = () => {
    dispatch(errorHandleScanner(scope, format, payload));
    dispatch(showModal({
      dismiss: null,
      confirm: 'modal.ok',
      title: 'modal.title_error',
      message: 'scanner.noResult.qrCode',
    })).then(confirmed => confirmed && Scanner.start());
  };

  switch (type) {
    case QR_CODE_TYPE_HOMEPAGE:
    case QR_CODE_TYPE_SEARCH:
      dispatch(successHandleScanner(scope, format, payload));
      dispatch(historyReplace({
        pathname: link,
      }));
      break;
    case QR_CODE_TYPE_COUPON:
      dispatch(successHandleScanner(scope, format, payload));
      dispatch(historyReplace({
        pathname: link,
      }));
      dispatch(historyPop());
      break;
    case QR_CODE_TYPE_PRODUCT:
    case QR_CODE_TYPE_PRODUCT_WITH_COUPON:
      // Force to fetch missing products
      await dispatch(fetchProductsById([data.productId]));

      // Check from a store
      if (!getProductById(getState(), data)) {
        notFound();
      } else {
        dispatch(successHandleScanner(scope, format, payload));
        dispatch(historyReplace({
          pathname: link,
        }));
      }
      break;
    case QR_CODE_TYPE_CATEGORY:
      await dispatch(fetchCategory(data.categoryId));

      if (!getCategoryById(getState(), data)) {
        notFound();
      } else {
        dispatch(successHandleScanner(scope, format, payload));
        dispatch(historyReplace({
          pathname: link,
        }));
      }
      break;
    case QR_CODE_TYPE_PAGE:
      // Force to fetch missing products
      await dispatch(fetchPageConfig(data.pageId));

      if (!getPageConfigById(getState(), data)) {
        notFound();
      } else {
        dispatch(successHandleScanner(scope, format, payload));
        dispatch(historyReplace({
          pathname: link,
        }));
      }
      break;
    default: notFound();
  }
  return null;
};

