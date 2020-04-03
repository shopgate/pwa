import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import { shouldFetchData, mutable } from '@shopgate/pwa-common/helpers/redux';
import requestProductImages from '../action-creators/requestProductImages';
import { SHOPGATE_CATALOG_GET_PRODUCT_IMAGES } from '../constants/Pipelines';
import receiveProductImages from '../action-creators/receiveProductImages';
import errorProductImages from '../action-creators/errorProductImages';

/**
 * Maybe requests images for a product from server.
 * @param {string} productId The product ID.
 * @return {Function} The dispatched action.
 */
function fetchProductImages(productId) {
  return (dispatch, getState) => {
    // TODO: use selector for imagesByProductId here!!
    const productImages = getState().product.imagesByProductId[productId];

    if (!shouldFetchData(productImages)) {
      return Promise.resolve(null);
    }
    dispatch(requestProductImages(productId));

    const request = new PipelineRequest(SHOPGATE_CATALOG_GET_PRODUCT_IMAGES)
      .setInput({ productId })
      .setVersion(3)
      .dispatch();

    request
      .then((result) => {
        dispatch(receiveProductImages(productId, result.images));
      })
      .catch((error) => {
        logger.error(error);
        dispatch(errorProductImages(productId, error.code));
      });

    return request;
  };
}

/** @mixes {MutableFunction} */
export default mutable(fetchProductImages);
