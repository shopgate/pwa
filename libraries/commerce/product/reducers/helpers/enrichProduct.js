/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { calcDiscount } from '../../helpers';

/**
 * Enriches a product object with additional properties that are helpful for the frontend,
 * but not available via the API.
 * @param {Object} productData A product object
 * @return {Object} The enriched product
 */
const enrichProduct = (productData) => {
  const newProductData = {
    ...productData,
  };

  if (newProductData.price) {
    let discount = 0;
    const discountBase = newProductData.price.msrp ?
      newProductData.price.msrp : newProductData.price.unitPriceStriked;

    if (newProductData.price.unitPrice < discountBase) {
      discount = calcDiscount(
        newProductData.price.unitPrice,
        discountBase
      );
    }

    newProductData.price.discount = discount;
  }

  return newProductData;
};

export default enrichProduct;
