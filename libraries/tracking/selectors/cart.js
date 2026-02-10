import { createSelector } from 'reselect';
import { getProduct } from '@shopgate/pwa-common-commerce/product/selectors/product';
import {
  getSubTotal,
  getCurrency,
  getCartProducts,
  getDiscountsAmount,
} from '@shopgate/pwa-common-commerce/cart/selectors/index';
import {
  convertPriceToString,
  formatCartProductData,
  formatAddToCartProductData,
} from '../helpers';

/**
 * Selects the products from the cart and reformat them.
 * @param {Object} state The current state.
 * @return {Array} The reformatted products.
 */
const getProducts = createSelector(
  getCartProducts,
  products => products.map(formatCartProductData)
);

/**
 * Selects products by ID and reformat them.
 * @param {Object} state The current state.
 * @param {Array} products Array of products.
 * @returns {Array} Formatted products.
 */
export const getAddToCartProducts = (state, products) => (
  products
    .map(product => ({
      product: getProduct(state, { productId: product.productId }),
      quantity: product.quantity,
    }))
    .map(formatAddToCartProductData)
);

/**
 * Selects the cart information.
 * @param {Object} state The current state.
 * @returns {Object} The cart information.
 */
export default createSelector(
  getSubTotal,
  getDiscountsAmount,
  getCurrency,
  getProducts,
  (subTotal, discounts, currency, products) => ({
    amount: {
      gross: convertPriceToString(subTotal - discounts),
      // TODO: Correct net prices are not possible atm.
      net: convertPriceToString(subTotal - discounts),
      currency,
    },
    products,
    productsCount: products.length,
  })
);
