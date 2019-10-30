import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import { shouldFetchData, mutable } from '@shopgate/pwa-common/helpers/redux';
import requestProductDescription from '../action-creators/requestProductDescription';
import { SHOPGATE_CATALOG_GET_PRODUCT_DESCRIPTION } from '../constants/Pipelines';
import receiveProductDescription from '../action-creators/receiveProductDescription';
import errorProductDescription from '../action-creators/errorProductDescription';
import { getProductDescription } from '../selectors/product';

/**
 * Maybe requests a product description from server.
 * @param {string} productId The product ID.
 * @return {Function} The dispatched action.
 */
function fetchProductDescription(productId) {
  return (dispatch, getState) => {
    const description = getProductDescription(getState(), { productId });

    if (!shouldFetchData(description)) {
      return Promise.resolve(null);
    }

    dispatch(requestProductDescription(productId));

    return new PipelineRequest(SHOPGATE_CATALOG_GET_PRODUCT_DESCRIPTION)
      .setInput({ productId })
      .dispatch()
      .then((result) => {
        dispatch(receiveProductDescription(productId, result.description));
        return result;
      })
      .catch((error) => {
        logger.error(error);
        dispatch(errorProductDescription(productId, error.code));
        return error;
      });
  };
}

/** @mixes {MutableFunction} */
export default mutable(fetchProductDescription);
