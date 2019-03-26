import showModal from '@shopgate/pwa-common/actions/modal/showModal';
import Scanner from '@shopgate/pwa-core/classes/Scanner';
import { historyReplace } from '@shopgate/pwa-common/actions/router';
import fetchProductsByQuery from '@shopgate/pwa-common-commerce/product/actions/fetchProductsByQuery';
import { getProductRoute } from '@shopgate/pwa-common-commerce/product/helpers';
import { getSearchRoute } from '@shopgate/pwa-common-commerce/search/helpers';

/**
 * Handle bar code
 * @param {string} [payload=''] bar code payload
 * @return {Function} A redux thunk.
 */
export default payload => async (dispatch) => {
  const {
    products = [],
  } = await dispatch(fetchProductsByQuery(2, payload));

  if (!products.length) {
    dispatch(showModal({
      dismiss: null,
      confirm: 'modal.ok',
      title: 'modal.title_error',
      message: 'scanner.noResult.barCode',
    })).then(confirmed => confirmed && Scanner.start());
  } else if (products.length === 1) {
    const [first] = products;
    const productId = typeof first === 'string' ? first : first.id;
    dispatch(historyReplace({
      pathname: getProductRoute(productId),
    }));
  } else {
    dispatch(historyReplace({
      pathname: getSearchRoute(payload),
    }));
  }
};

