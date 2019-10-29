import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import { shouldFetchData, mutable } from '@shopgate/pwa-common/helpers/redux';
import requestProductVariants from '../action-creators/requestProductVariants';
import * as pipelines from '../constants/Pipelines';
import receiveProductVariants from '../action-creators/receiveProductVariants';
import errorProductVariants from '../action-creators/errorProductVariants';

/**
 * Retrieves product variants from store.
 * @param {string} productId The product ID for which the product variants are requested.
 * @return {Function} A Redux Thunk
 */
const fetchProductVariants = productId => (dispatch, getState) => {
  const state = getState();
  const cachedData = state.product.variantsByProductId[productId];

  if (!shouldFetchData(cachedData)) {
    return;
  }

  dispatch(requestProductVariants(productId));

  new PipelineRequest(pipelines.SHOPGATE_CATALOG_GET_PRODUCT_VARIANTS)
    .setInput({ productId })
    .dispatch()
    .then(result => dispatch(receiveProductVariants(productId, result)))
    .catch((error) => {
      logger.error(error);
      dispatch(errorProductVariants(productId, error.code));
    });
};

/** @mixes {MutableFunction} */
export default mutable(fetchProductVariants);
