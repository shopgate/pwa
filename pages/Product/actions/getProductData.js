import { getCurrentBaseProductId } from '@shopgate/pwa-common-commerce/product/selectors/product';
import getProduct from '@shopgate/pwa-common-commerce/product/actions/getProduct';
import { requestProductData } from '../action-creators';

/**
 * Triggers the fetching of all product data for a certain product ID.
 * @param {string} [selectedVariantId=null] The selected variant's ID.
 * @return {Function} The dispatched action.
 */
const getProductData = (selectedVariantId = null) =>
  (dispatch, getState) => {
    const state = getState();
    const currentProductId = getCurrentBaseProductId(state);
    const productId = selectedVariantId || currentProductId;

    if (!productId) {
      return;
    }

    dispatch(requestProductData(productId, selectedVariantId));
    dispatch(getProduct(productId));
  };

export default getProductData;
