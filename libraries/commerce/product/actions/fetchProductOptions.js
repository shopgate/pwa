import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import { shouldFetchData, mutable } from '@shopgate/pwa-common/helpers/redux';
import requestProductOptions from '../action-creators/requestProductOptions';
import * as pipelines from '../constants/Pipelines';
import receiveProductOptions from '../action-creators/receiveProductOptions';
import errorProductOptions from '../action-creators/errorProductOptions';

/**
 * Retrieves product options from store.
 * @param {string} productId The product ID for which the product options are requested.
 * @return {Function} A Redux Thunk
 */
const fetchProductOptions = productId => (dispatch, getState) => {
  const state = getState();
  const cachedData = state.product.optionsByProductId[productId];

  if (!shouldFetchData(cachedData)) {
    return;
  }

  dispatch(requestProductOptions(productId));

  new PipelineRequest(pipelines.SHOPGATE_CATALOG_GET_PRODUCT_OPTIONS)
    .setInput({ productId })
    .dispatch()
    .then(result => dispatch(receiveProductOptions(productId, result.options)))
    .catch((error) => {
      logger.error(error);
      dispatch(errorProductOptions(productId, error.code));
    });
};

/** @mixes {MutableFunction} */
export default mutable(fetchProductOptions);
