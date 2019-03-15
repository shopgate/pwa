import showModal from '@shopgate/pwa-common/actions/modal/showModal';
import Scanner from '@shopgate/pwa-core/classes/Scanner';
import { historyPush } from '@shopgate/pwa-common/actions/router';
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
};

