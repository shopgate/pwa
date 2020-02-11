import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
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

    const request = new PipelineRequest(SHOPGATE_CATALOG_GET_PRODUCT_OPTIONS)
      .setInput({ productId })
      .dispatch();

    request
      .then((result) => {
        dispatch(receiveProductOptions(productId, result.options));
      })
      .catch((error) => {
        dispatch(errorProductOptions(productId, error.code));
      });

    return request;
  };
}

/** @mixes {MutableFunction} */
export default mutable(fetchProductOptions);
