/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import setProductId from '@shopgate/pwa-common-commerce/product/action-creators/setProductId';
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
 * @param {string} [baseProductId=null] The base product ID.
 * @return {Function} The dispatched action.
 */
const getProductData = (selectedVariantId = null, baseProductId = null) =>
  (dispatch, getState) => {
    const state = getState();
    const currentProductId = getCurrentBaseProductId(state);
    const currentVariantId = getCurrentProductVariantId(state);
    const parentId = baseProductId ? hex2bin(baseProductId) : currentProductId;
    const productId = selectedVariantId || parentId;

    if (!productId) {
      return;
    }

    dispatch(requestProductData(productId, selectedVariantId));

    /**
     * Only set current product id (parent id) if we don't have a child product selected
     * or when the current product id should be updated
     */
    if (!selectedVariantId && (currentProductId !== parentId)) {
      dispatch(setProductId(parentId));
    }

    /**
     * Only set current variant id if it changed
     */
    if (currentVariantId !== selectedVariantId) {
      dispatch(setProductVariantId(selectedVariantId));
    }

    dispatch(getProduct(productId));
    dispatch(getProductDescription(productId));
    dispatch(getProductProperties(productId));
    dispatch(getProductImages(productId));
    dispatch(getProductShipping(productId));
  };

export default getProductData;
