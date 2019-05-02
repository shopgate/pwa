import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import { shouldFetchData } from '@shopgate/pwa-common/helpers/redux';
import * as pipelines from '../constants/Pipelines';
import requestProduct from '../action-creators/requestProduct';
import receiveProduct from '../action-creators/receiveProduct';
import errorProduct from '../action-creators/errorProduct';
import receiveProductCached from '../action-creators/receiveProductCached';
import { getProductById } from '../selectors/product';

/**
 * Retrieves a product from the Redux store.
 * @param {string} productId The product ID.
 * @param {boolean} forceFetch Skips shouldFetchData check. Always fetches.
 * @return {Function} A redux thunk.
 */
const fetchProduct = (productId, forceFetch = false) => (dispatch, getState) => {
  const state = getState();
  const product = getProductById(state, { productId });

  if (!forceFetch && !shouldFetchData(product)) {
    if (product.productData) {
      dispatch(receiveProductCached(product.productData));
    }

    return;
  }

  dispatch(requestProduct(productId, forceFetch));

  new PipelineRequest(pipelines.SHOPGATE_CATALOG_GET_PRODUCT)
    .setInput({ productId })
    .dispatch()
    .then((result) => {
      dispatch(receiveProduct(productId, result));
    })
    .catch((error) => {
      logger.error(error);
      dispatch(errorProduct(productId, error.code));
    });
};

export default fetchProduct;
