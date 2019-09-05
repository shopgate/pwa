import { historyReplace } from '@shopgate/pwa-common/actions/router';
import fetchProductsByQuery from '@shopgate/pwa-common-commerce/product/actions/fetchProductsByQuery';
import { getProductRoute } from '@shopgate/pwa-common-commerce/product/helpers';
import { getSearchRoute } from '@shopgate/pwa-common-commerce/search/helpers';

/**
 * Handle product search. The thunk will return false if nothing was found or true if it processed
 * the action as it should.
 * @param {string} searchPhrase The search phrase.
 * @return {Function} A redux thunk.
 */
export default searchPhrase => async (dispatch) => {
  const {
    products = [],
  } = await dispatch(fetchProductsByQuery(2, searchPhrase));

  // Redirect to product when only one was found and to search for more. Abort on no results.
  if (!products.length) {
    return false;
  }

  if (products.length === 1) {
    const [first] = products;
    const productId = typeof first === 'string' ? first : first.id;
    dispatch(historyReplace({
      pathname: getProductRoute(productId),
    }));
  } else {
    dispatch(historyReplace({
      pathname: getSearchRoute(searchPhrase),
    }));
  }

  return true;
};

