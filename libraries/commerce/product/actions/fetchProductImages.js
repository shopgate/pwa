import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import { shouldFetchData, mutable } from '@shopgate/pwa-common/helpers/redux';
import requestProductImages from '../action-creators/requestProductImages';
import { SHOPGATE_CATALOG_GET_PRODUCT_IMAGES } from '../constants/Pipelines';
import receiveProductImages from '../action-creators/receiveProductImages';
import errorProductImages from '../action-creators/errorProductImages';
import { getProductImages } from '../selectors/product';

/**
 * Maybe requests images for a product from server.
 * @param {string} productId The product ID.
 * @param {Array} [formats] The requested formats.
 * @return {Function} The dispatched action.
 */
function fetchProductImages(productId, formats) {
  return (dispatch, getState) => {
    const productImages = getProductImages(getState(), { productId });

    if (!shouldFetchData(productImages)) {
      return Promise.resolve(null);
    }

    let version = 1;
    const input = { productId };

    if (formats) {
      input.formats = formats;
      version = 2;
    }

    dispatch(requestProductImages(productId, formats));

    const request = new PipelineRequest(SHOPGATE_CATALOG_GET_PRODUCT_IMAGES)
      .setInput(input)
      .setVersion(version)
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
