import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import { shouldFetchData } from '@shopgate/pwa-common/helpers/redux';
import requestProductImages from '../action-creators/requestProductImages';
import * as pipelines from '../constants/Pipelines';
import receiveProductImages from '../action-creators/receiveProductImages';
import errorProductImages from '../action-creators/errorProductImages';

/**
 * Maybe requests images for a product from server.
 * @param {string} productId The product ID.
 * @return {Function} The dispatched action.
 */
const fetchProductImages = productId => (dispatch, getState) => {
  const state = getState();
  const productImages = state.product.imagesByProductId[productId];

  if (!shouldFetchData(productImages)) {
    return;
  }

  dispatch(requestProductImages(productId));

  new PipelineRequest(pipelines.SHOPGATE_CATALOG_GET_PRODUCT_IMAGES)
    .setInput({ productId })
    .dispatch()
    .then(result => dispatch(receiveProductImages(productId, result.images)))
    .catch((error) => {
      logger.error(error);
      dispatch(errorProductImages(productId));
    });
};

export default fetchProductImages;
