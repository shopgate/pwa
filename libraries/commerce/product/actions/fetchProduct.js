import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import configuration from '@shopgate/pwa-common/collections/Configuration';
import { DEFAULT_PRODUCTS_FETCH_PARAMS } from '@shopgate/pwa-common/constants/Configuration';
import { shouldFetchData, mutable } from '@shopgate/pwa-common/helpers/redux';
import { LoadingProvider } from '@shopgate/pwa-common/providers';
import { getCurrentRoute } from '@shopgate/pwa-common/helpers/router';
import { SHOPGATE_CATALOG_GET_PRODUCT } from '../constants/Pipelines';
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
function fetchProduct(productId, forceFetch = false) {
  return (dispatch, getState) => {
    const state = getState();
    const product = getProductById(state, { productId });
    LoadingProvider.setLoading(getCurrentRoute().pathname);

    if (!forceFetch && !shouldFetchData(product)) {
      if (product.productData) {
        dispatch(receiveProductCached(product.productData));
      }

      return undefined;
    }

    const requestParams = {
      ...configuration.get(DEFAULT_PRODUCTS_FETCH_PARAMS),
      productId,
    };

    dispatch(requestProduct(productId, forceFetch));

    const request = new PipelineRequest(SHOPGATE_CATALOG_GET_PRODUCT)
      .setInput(requestParams)
      .dispatch();

    request
      .then((result) => {
        dispatch(receiveProduct(productId, result));
      })
      .catch((error) => {
        dispatch(errorProduct(productId, error.code));
      });

    return request;
  };
}

/** @mixes {MutableFunction} */
export default mutable(fetchProduct);
