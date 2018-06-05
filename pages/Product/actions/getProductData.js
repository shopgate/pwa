import setProductVariantId from '@shopgate/pwa-common-commerce/product/action-creators/setProductVariantId';
import { getCurrentBaseProductId } from '@shopgate/pwa-common-commerce/product/selectors/product';
import { getCurrentProductVariantId } from '@shopgate/pwa-common-commerce/product/selectors/variants';
import getProduct from '@shopgate/pwa-common-commerce/product/actions/getProduct';
import getProductDescription from '@shopgate/pwa-common-commerce/product/actions/getProductDescription';
import getProductProperties from '@shopgate/pwa-common-commerce/product/actions/getProductProperties';
import getProductImages from '@shopgate/pwa-common-commerce/product/actions/getProductImages';
import getProductShipping from '@shopgate/pwa-common-commerce/product/actions/getProductShipping';
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
    const currentVariantId = getCurrentProductVariantId(state);
    const productId = selectedVariantId || currentProductId;

    if (!productId) {
      return;
    }

    dispatch(requestProductData(productId, selectedVariantId));

    /**
     * Only set current variant id if it changed
     */
    if (currentVariantId !== selectedVariantId) {
      // Dispatch(setProductVariantId(selectedVariantId));
    }

    dispatch(getProduct(productId));
    // Dispatch(getProductDescription(productId));
    // Dispatch(getProductProperties(productId));
    // Dispatch(getProductImages(productId));
    // Dispatch(getProductShipping(productId));
  };

export default getProductData;
