import appConfig from '@shopgate/pwa-common/helpers/config';
import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import { shouldFetchData } from '@shopgate/pwa-common/helpers/redux';
import { SHOPGATE_CATALOG_GET_PRODUCT_MEDIA } from '../constants/Pipelines';
import requestProductMedia from '../action-creators/requestProductMedia';
import receiveProductMedia from '../action-creators/receiveProductMedia';
import errorProductMedia from '../action-creators/errorProductMedia';

/**
 * Retrieves product options from store.
 * @param {string} productId The product ID for which the product options are requested.
 * @return {Function} A Redux Thunk
 */
const fetchProductMedia = productId => (dispatch, getState) => {
  if (!appConfig.beta) {
    return;
  }

  const state = getState();
  const cachedData = state.product.mediaByProductId[productId];

  if (!shouldFetchData(cachedData)) {
    return;
  }

  dispatch(requestProductMedia(productId));

  new PipelineRequest(SHOPGATE_CATALOG_GET_PRODUCT_MEDIA)
    .setInput({ productId })
    .dispatch()
    .then(result => dispatch(receiveProductMedia(productId, result.media)))
    .catch((error) => {
      logger.error(error);
      dispatch(errorProductMedia(productId, error.code));
    });
};

export default fetchProductMedia;
