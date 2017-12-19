/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import get from 'lodash/get';
import core from '@shopgate/tracking-core/core/Core';
import { logger } from '@shopgate/pwa-core/helpers';
import event from '@shopgate/pwa-core/classes/Event';

/**
 * Converts a price to a formatted string.
 * @param {number} price The original price.
 * @return {string|*} The converted price or the original value, if the price was not convertible.
 */
export const convertPriceToString = (price) => {
  if (typeof price === 'number') {
    return price.toFixed(2);
  }

  return price;
};

/**
 * Re-format a given product form the store.
 * @param {Object} productData The product data from the store
 * @returns {Object|null} The formatted product.
 */
export const formatProductData = (productData) => {
  if (!productData) {
    return null;
  }

  const { id, name, price, manufacturer, tags = [] } = productData;

  return {
    name,
    manufacturer,
    tags,
    uid: id,
    amount: {
      net: convertPriceToString(price.unitPriceNet),
      gross: convertPriceToString(price.unitPriceWithTax),
      striked: convertPriceToString(price.unitPriceStriked),
      currency: price.currency,
    },
  };
};

/**
 * Reformat product data for addToCart from the store to the format our core expects.
 * @param {Object} product Product from the store
 * @param {Object} quantity Quantity of the product
 * @return {Object}
 */
export const formatAddToCartProductData = ({ product, quantity }) => ({
  ...formatProductData(product),
  quantity,
});

/**
 * Reformat product data from the store to the format our core expects.
 * @param {Object} product Product from the store
 * @param {Object} quantity Quantity of the product
 * @return {Object}
 */
export const formatCartProductData = ({ product, quantity }) => ({
  uid: product.id,
  name: product.name,
  amount: {
    gross: convertPriceToString(product.price.unit),
  },
  quantity,
});

/**
 * Reformat order data from web checkout to the format our core expects.
 * @param {Object} order Information about the order.
 * @return {Object}
 */
export const formatPurchaseData = (order = {}) => {
  let grandTotal = 0;
  let shipping = 0;
  let tax = 0;
  let products = [];

  if (Array.isArray(order.totals)) {
    order.totals.forEach((total) => {
      switch (total.type) {
        case 'grandTotal':
          grandTotal = total.amount;
          break;
        case 'shipping':
          shipping = total.amount;
          break;
        case 'tax':
          tax = total.amount;
          break;
        default:
          break;
      }
    });
  }

  const grandTotalNet = grandTotal - tax;

  if (Array.isArray(order.products)) {
    products = order.products.map(product => ({
      uid: product.id || '',
      productNumber: product.id || '',
      name: product.name || '',
      quantity: product.quantity || 1,
      amount: {
        currency: order.currency || '',
        gross: convertPriceToString(get(product, 'price.withTax', 0)),
        net: convertPriceToString(get(product, 'price.net', 0)),
      },
    }));
  }

  return {
    order: {
      number: order.number || '',
      amount: {
        currency: order.currency || '',
        gross: convertPriceToString(grandTotal),
        net: convertPriceToString(grandTotalNet),
        tax: convertPriceToString(tax),
      },
      shipping: {
        amount: {
          gross: convertPriceToString(shipping),
          net: convertPriceToString(shipping),
        },
      },
      products,
    },
  };
};

/**
 * Flag to enable/disable the tracking.
 * @type {boolean}
 */
let trackingDisabled = false;

// Disable the tracking if the webview is not in the foreground anymore
event.addCallback('viewWillDisappear', () => {
  trackingDisabled = true;
});
// Enable the tracking if the webview enters the foreground
event.addCallback('viewWillAppear', () => {
  trackingDisabled = false;
});

/**
 * Helper to pass the redux state to the tracking core
 * @param {string} eventName The name of the event.
 * @param {Object} data The tracking data of the event.
 * @param {Object} state The current redux state.
 * @return {Core|boolean}
 */
export const track = (eventName, data, state) => {
  if (typeof core.track[eventName] !== 'function') {
    logger.warn('Unknown tracking event:', eventName);
    return false;
  }

  if (trackingDisabled) {
    logger.warn('Tracking disabled');
    return false;
  }

  return core.track[eventName](data, undefined, undefined, state);
};
