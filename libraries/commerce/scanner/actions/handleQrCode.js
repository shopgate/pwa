import { historyPop, historyReplace } from '@shopgate/pwa-common/actions/router';
import { fetchPageConfig } from '@shopgate/pwa-common/actions/page';
import { getPageConfigById } from '@shopgate/pwa-common/selectors/page';
import { fetchProductsById, getProductById } from '@shopgate/pwa-common-commerce/product';
import { fetchCategory, getCategoryById } from '@shopgate/pwa-common-commerce/category';
import successHandleScanner from '../action-creators/successHandleScanner';
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
import handleSearch from './handleSearch';
import handleNoResults from './handleNoResults';

/**
 * Handle qr code
 * @param {string} event.scope Scanner scope.
 * @param {string} event.format Format of the scanned code.
 * @param {string} event.payload Barcode payload.
 * @return {Function} A redux thunk.
 */
export default ({ scope, format, payload }) => async (dispatch, getState) => {
  const { type, link, data } = parse2dsQrCode(payload) || {};

  /**
   * Helper function to handle no scan results
   * @return {Function}
   */
  const notFound = () => dispatch(handleNoResults({
    scope,
    format,
    payload,
  }, 'scanner.noResult.qrCode'));

  switch (type) {
    case QR_CODE_TYPE_HOMEPAGE:
      dispatch(successHandleScanner(scope, format, payload));
      dispatch(historyReplace({
        pathname: link,
      }));
      break;
    case QR_CODE_TYPE_SEARCH:
      if (await dispatch(handleSearch(data.searchPhrase || ''))) {
        dispatch(successHandleScanner(scope, format, payload));
      } else {
        notFound();
      }
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

