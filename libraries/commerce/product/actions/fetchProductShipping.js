import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import { shouldFetchData, mutable } from '@shopgate/pwa-common/helpers/redux';
import { SHOPGATE_CATALOG_GET_PRODUCT_SHIPPING } from '../constants/Pipelines';
import requestProductShipping from '../action-creators/requestProductShipping';
import receiveProductShipping from '../action-creators/receiveProductShipping';
import errorProductShipping from '../action-creators/errorProductShipping';
import { getProductShipping } from '../selectors/product';

/**
 * Retrieves product shipping from the store.
 * @param {string} productId The product ID for which the product shipping is requested.
 * @return {Function} A Redux Thunk
 */
function fetchProductShipping(productId) {
  return (dispatch, getState) => {
    const shipping = getProductShipping(getState(), { productId });

    if (!shouldFetchData(shipping)) {
      return Promise.resolve(null);
    }

    dispatch(requestProductShipping(productId));

    return new PipelineRequest(SHOPGATE_CATALOG_GET_PRODUCT_SHIPPING)
      .setInput({ productId })
      .dispatch()
      .then((result) => {
        dispatch(receiveProductShipping(productId, result.shipping));
        return result;
      })
      .catch((error) => {
        logger.error(error);
        dispatch(errorProductShipping(productId, error.code));
        return error;
      });
  };
}

/** @mixes {MutableFunction} */
export default mutable(fetchProductShipping);
