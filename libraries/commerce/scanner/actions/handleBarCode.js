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
    totalProductCount,
    products,
  } = await dispatch(fetchProductsByQuery(2, payload));

  if (!totalProductCount) {
    dispatch(showModal({
      dismiss: null,
      confirm: 'modal.ok',
      title: 'modal.title_error',
      message: 'scanner.noResult.barCode',
    })).then(confirmed => confirmed && Scanner.start());
  } else if (Number(totalProductCount) === 1) {
    dispatch(historyReplace({
      pathname: getProductRoute(products[0].id),
    }));
  } else {
    dispatch(historyReplace({
      pathname: getSearchRoute(payload),
    }));
  }
};

