import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import { shouldFetchData } from '@shopgate/pwa-common/helpers/redux';
import * as pipelines from '../constants/Pipelines';
import requestProduct from '../action-creators/requestProduct';
import receiveProduct from '../action-creators/receiveProduct';
import errorProduct from '../action-creators/errorProduct';
import receiveProductCached from '../action-creators/receiveProductCached';
import processProductFlags from './processProductFlags';
import { getProductById } from '../selectors/product';

/**
 * Retrieves a product from the Redux store.
 * @param {string} productId The product ID.
 * @param {boolean} [forceFetch=false] Skips shouldFetchData check. Always fetches.
 * @param {boolean} [shouldProcessProductFlags=true] Skips processProductFlags()
 * @return {Function} A redux thunk.
 */
const getProduct = (
  productId,
  forceFetch = false,
  shouldProcessProductFlags = true
) => (dispatch, getState) => {
  const state = getState();
  const product = getProductById(state, productId);

  if (!forceFetch && !shouldFetchData(product)) {
    if (product.productData) {
      if (!shouldProcessProductFlags) {
        dispatch(receiveProductCached(product.productData));
        return;
      }
      dispatch(processProductFlags(product.productData))
        .then(() => {
          dispatch(receiveProductCached(product.productData));
        });
    }

    return;
  }

  dispatch(requestProduct(productId));

  new PipelineRequest(pipelines.SHOPGATE_CATALOG_GET_PRODUCT)
    .setInput({ productId })
    .dispatch()
    .then((result) => {
      if (shouldProcessProductFlags) {
        dispatch(processProductFlags(result));
      }

      dispatch(receiveProduct(productId, result));
    })
    .catch((error) => {
      logger.error(error);
      dispatch(errorProduct(productId));
    });
};

export default getProduct;
