import appConfig from '@shopgate/pwa-common/helpers/config';
import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import { shouldFetchData, mutable } from '@shopgate/pwa-common/helpers/redux';
import { SHOPGATE_CATALOG_GET_PRODUCT_MEDIA } from '../constants/Pipelines';
import requestProductMedia from '../action-creators/requestProductMedia';
import receiveProductMedia from '../action-creators/receiveProductMedia';
import errorProductMedia from '../action-creators/errorProductMedia';

/**
 * Retrieves product options from store.
 * @param {string} productId The product ID for which the product options are requested.
 * @return {Function} A Redux Thunk
 */
function fetchProductMedia(productId) {
  return (dispatch, getState) => {
    if (!appConfig.beta) {
      return Promise.resolve(null);
    }

    const state = getState();
    const cachedData = state.product.mediaByProductId[productId];

    if (!shouldFetchData(cachedData)) {
      return Promise.resolve(null);
    }

    dispatch(requestProductMedia(productId));

    const request = new PipelineRequest(SHOPGATE_CATALOG_GET_PRODUCT_MEDIA)
      .setInput({ productId })
      .dispatch();

    request
      .then((result) => {
        dispatch(receiveProductMedia(productId, result.media));
      })
      .catch((error) => {
        logger.error(error);
        dispatch(errorProductMedia(productId, error.code));
      });

    return request;
  };
}

/** @mixes {MutableFunction} */
export default mutable(fetchProductMedia);
