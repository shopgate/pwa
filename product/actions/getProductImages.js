import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import { shouldFetchData } from '@shopgate/pwa-common/helpers/redux';
import {
  requestProductImages,
  receiveProductImages,
  errorProductImages,
} from '../action-creators';

/**
 * Maybe requests images for a product from server.
 * @param {string} productId The product ID.
 * @return {Function} The dispatched action.
 */
const getProductImages = productId => (dispatch, getState) => {
  const state = getState();
  const productImages = state.product.imagesByProductId[productId];

  if (!shouldFetchData(productImages)) {
    return;
  }

  dispatch(requestProductImages(productId));

  new PipelineRequest('getProductImages')
    .setInput({ productId })
    .dispatch()
      .then(result => dispatch(receiveProductImages(productId, result.images)))
      .catch((error) => {
        logger.error(error);
        dispatch(errorProductImages(productId));
      });
};

export default getProductImages;
