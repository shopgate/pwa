import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { shouldFetchData, mutable } from '@shopgate/pwa-common/helpers/redux';
import requestProductDescription from '../action-creators/requestProductDescription';
import { SHOPGATE_CATALOG_GET_PRODUCT_DESCRIPTION } from '../constants/Pipelines';
import receiveProductDescription from '../action-creators/receiveProductDescription';
import errorProductDescription from '../action-creators/errorProductDescription';

/**
 * Maybe requests a product description from server.
 * @param {string} productId The product ID.
 * @return {Function} The dispatched action.
 */
function fetchProductDescription(productId) {
  return (dispatch, getState) => {
    const description = getState().product.descriptionsByProductId[productId];

    if (!shouldFetchData(description)) {
      return Promise.resolve(null);
    }

    dispatch(requestProductDescription(productId));

    const request = new PipelineRequest(SHOPGATE_CATALOG_GET_PRODUCT_DESCRIPTION)
      .setInput({ productId })
      .dispatch();

    request
      .then((result) => {
        dispatch(receiveProductDescription(productId, result.description));
      })
      .catch((error) => {
        dispatch(errorProductDescription(productId, error.code));
      });

    return request;
  };
}

/** @mixes {MutableFunction} */
export default mutable(fetchProductDescription);
