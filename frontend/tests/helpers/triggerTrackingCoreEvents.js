import { sgData, sgDataOrder, sgDataSearch, sgDataCheckout, product, addedToCartProduct } from '../data/tracking.testData';

const SgTrackingCore = require('../../shopgate-tracking-core').default.reset();

export function completedRegistration() {
  const data = { ...sgData, registrationType: 'guest' };
  SgTrackingCore.track.completedRegistration(data);
  return data;
}

export function viewContent() {
  SgTrackingCore.track.viewContent(sgData);
  return sgData;
}

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

export function purchase() {
  SgTrackingCore.track.purchase(sgDataOrder);
  return sgDataOrder;
}

export function initiatedCheckout() {
  const data = {
    ...sgDataCheckout,
    checkoutType: 'paypal_express',
    quantity: 2,
  };

  SgTrackingCore.track.initiatedCheckout(data);
  return data;
}

export function addToCart() {
  SgTrackingCore.track.addToCart(addedToCartProduct);
  return addedToCartProduct;
}

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

export function search() {
  SgTrackingCore.track.search(sgDataSearch);
  return sgDataSearch;
}
