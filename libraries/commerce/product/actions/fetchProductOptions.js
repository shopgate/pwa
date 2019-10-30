import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import { shouldFetchData, mutable } from '@shopgate/pwa-common/helpers/redux';
import requestProductOptions from '../action-creators/requestProductOptions';
import { SHOPGATE_CATALOG_GET_PRODUCT_OPTIONS } from '../constants/Pipelines';
import receiveProductOptions from '../action-creators/receiveProductOptions';
import errorProductOptions from '../action-creators/errorProductOptions';

/**
 * Retrieves product options from store.
 * @param {string} productId The product ID for which the product options are requested.
 * @return {Function} A Redux Thunk
 */
function fetchProductOptions(productId) {
  return (dispatch, getState) => {
    const state = getState();
    const cachedData = state.product.optionsByProductId[productId];

    if (!shouldFetchData(cachedData)) {
      return Promise.resolve(null);
    }

    dispatch(requestProductOptions(productId));

    return new PipelineRequest(SHOPGATE_CATALOG_GET_PRODUCT_OPTIONS)
      .setInput({ productId })
      .dispatch()
      .then((result) => {
        dispatch(receiveProductOptions(productId, result.options));
        return result;
      })
      .catch((error) => {
        logger.error(error);
        dispatch(errorProductOptions(productId, error.code));
        return error;
      });
  };
}

/** @mixes {MutableFunction} */
export default mutable(fetchProductOptions);
