import {
  sgData, sgDataOrder, sgDataSearch, sgDataCheckout, product, addedToCartProduct,
} from '../data/tracking.testData';

const SgTrackingCore = require('../../core/Core').default.reset();

/**
 * Triggers completedRegistration with data
 * @returns {Object}
 */
export function completedRegistration() {
  const data = {
    ...sgData,
    registrationType: 'guest',
  };
  SgTrackingCore.track.completedRegistration(data);
  return data;
}

/**
 * Triggers viewContent with data
 * @returns {Object}
 */
export function viewContent() {
  SgTrackingCore.track.viewContent(sgData);
  return sgData;
}

/**
 * Triggers addedPaymentInfo with data
 * @returns {Object}
 */
export function addedPaymentInfo() {
  const data = {
    ...sgData,
    paymentMethodAdded: {
      success: true,
      name: 'Paypal',
    },
  };

  SgTrackingCore.track.addedPaymentInfo(data);
  return sgData;
}

/**
 * Triggers purchase with data
 * @returns {Object}
 */
export function purchase() {
  SgTrackingCore.track.purchase(sgDataOrder);
  return sgDataOrder;
}

/**
 * Triggers initiatedCheckout with data
 * @returns {Object}
 */
export function initiatedCheckout() {
  const data = {
    ...sgDataCheckout,
    checkoutType: 'paypal_express',
    quantity: 2,
  };

  SgTrackingCore.track.initiatedCheckout(data);
  return data;
}

/**
 * Triggers addToCart with data
 * @returns {Object}
 */
export function addToCart() {
  SgTrackingCore.track.addToCart(addedToCartProduct);
  return addedToCartProduct;
}

/**
 * Triggers addToWishlist with data
 * @returns {Object}
 */
export function addToWishlist() {
  const data = {
    ...sgData,
    favouriteListProducts: [
      product,
    ],
  };

  SgTrackingCore.track.addToWishlist(data);
  return data;
}

/**
 * Triggers search with data
 * @returns {Object}
 */
export function search() {
  SgTrackingCore.track.search(sgDataSearch);
  return sgDataSearch;
}
