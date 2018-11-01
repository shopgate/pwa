import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import { shouldFetchData } from '@shopgate/pwa-common/helpers/redux';
import requestProductImagesResolutions from '../action-creators/requestProductImagesResolutions';
import * as pipelines from '../constants/Pipelines';
import receiveProductImagesResolutions from '../action-creators/receiveProductImagesResolutions';
import errorProductImagesResolutions from '../action-creators/errorProductImagesResolutions';

/**
 * Maybe requests images for a product from server.
 * @param {string} productId The product ID.
 * @param {Array} resolutions format '$widthx$height' i.e. ['440x440']
 * @return {Function} The dispatched action.
 */
const getProductImagesResolutions = (productId, resolutions) => (dispatch, getState) => {
  const state = getState();
  const productImages = state.product.imagesResolutionsByProductId[productId];

  if (!shouldFetchData(productImages)) {
    return;
  }

  dispatch(requestProductImagesResolutions(productId, resolutions));

  new PipelineRequest(pipelines.SHOPGATE_CATALOG_GET_PRODUCT_IMAGES)
    .setInput({ productId, resolutions })
    .dispatch()
    .then(result =>
      dispatch(receiveProductImagesResolutions(productId, result.resolutions || {})))
    .catch((error) => {
      logger.error(error);
      dispatch(errorProductImagesResolutions(productId));
    });
};

export default getProductImagesResolutions;
