/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Calculates the percentage discount for two unit prices.
 * @param {number} price The current price.
 * @param {number} priceOld The old price.
 * @return {number} The discount.
 */
export const calcDiscount = (price, priceOld) => {
  const savedAmount = priceOld - price;
  const discount = Math.round((savedAmount / priceOld) * 100);
  return (discount > 0) ? discount : 0;
};
