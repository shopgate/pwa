import { appConfig } from '@shopgate/engage';

const {
  productPrices: {
    mapPrice: {
      showPLP,
      showSlider,
      showPDP,
      showCart,
      showHintPLP,
      showHintSlider,
      showHintPDP,
      hint,
    } = {},
  } = {},
} = appConfig;

/** @type {boolean} */
export const isVisiblePLP = !!showPLP;
/** @type {boolean} */
export const isVisibleSlider = !!showSlider;
/** @type {boolean} */
export const isVisiblePDP = !!showPDP;
/** @type {boolean} */
export const isVisibleCart = !!showCart;
/** @type {boolean} */
export const isHintVisiblePLP = !!hint && !!showHintPLP;
/** @type {boolean} */
export const isHintVisibleSlider = !!hint && !!showHintSlider;
/** @type {boolean} */
export const isHintVisiblePDP = !!hint && !!showHintPDP;

/** @returns {undefined|string} */
export const getHint = () => hint;

/**
 * @param {Object} productPrice product.price object
 * @returns {boolean}
 */
export const showHint = (productPrice) => {
  const { unitPrice = 0, mapPricing: { price = 0, startDate, endDate } = {} } = productPrice || {};
  // No price or price is less
  if (!price || price <= unitPrice) {
    return false;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (!start.getDate() || !end.getDate()) {
    // dates invalid
    return false;
  }

  const now = new Date();
  if (now < start || now > end) {
    return false;
  }
  return true;
};

