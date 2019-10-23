import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import { shouldFetchData, mutable } from '@shopgate/pwa-common/helpers/redux';
import requestProductImages from '../action-creators/requestProductImages';
import * as pipelines from '../constants/Pipelines';
import receiveProductImages from '../action-creators/receiveProductImages';
import errorProductImages from '../action-creators/errorProductImages';

/**
 * Maybe requests images for a product from server.
 * @param {string} productId The product ID.
 * @param {Array} [formats] The requested formats.
 * @return {Function} The dispatched action.
 */
const fetchProductImages = (productId, formats) => (dispatch, getState) => {
  const state = getState();
  const productImages = state.product.imagesByProductId[productId];

  if (!shouldFetchData(productImages)) {
    return;
  }

  let version = 1;
  const input = { productId };
  if (formats) {
    input.formats = formats;
    version = 2;
  }

  dispatch(requestProductImages(productId, formats));

  new PipelineRequest(pipelines.SHOPGATE_CATALOG_GET_PRODUCT_IMAGES)
    .setInput(input)
    .setVersion(version)
    .dispatch()
    .then((result) => {
      dispatch(receiveProductImages(productId, result.images));
    })
    .catch((error) => {
      logger.error(error);
      dispatch(errorProductImages(productId, error.code));
    });
};

/** @mixes {MutableFunction} */
export default mutable(fetchProductImages);
