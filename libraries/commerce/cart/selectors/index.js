import { createSelector } from 'reselect';
import sumBy from 'lodash/sumBy';
import { getBaseProductMetadata } from '../../product/selectors/product';
import { getSelectedVariantMetadata } from '../../product/selectors/variants';
import {
  getRawProductOptions,
  hasProductOptions,
  areProductOptionsSet,
} from '../../product/selectors/options';
import {
  CART_ITEM_TYPE_PRODUCT,
  CART_ITEM_TYPE_COUPON,
  CART_TOTALS_TYPE_SUB,
  CART_TOTALS_TYPE_GRAND,
  CART_TOTALS_TYPE_DISCOUNT,
  CART_TOTALS_TYPE_SHIPPING,
  CART_TOTALS_TYPE_TAX,
} from '../constants';

/**
 * Selects the cart data from the store.
 * @param {Object} state The current state.
 * @return {Object}
 */
const getCart = state => state.cart;

/**
 * Selects the cartItems from the current cart in the state.
 * @param {Object} state The current state.
 * @return {Array} The cartItems.
 */
const cartItemsSelector = state => state.cart.items;

/**
 * Selects the total amounts stack from the cart data.
 * @param {Object} state The current application state.
 * @return {Object} The total amount stack.
 */
const getTotals = createSelector(
  getCart,
  cart => cart.totals
);

/**
 * Selects all items from the cart.
 * @param {Object} state The current state.
 * @return {Array} The cart items.
 */
export const getCartItems = createSelector(
  cartItemsSelector,
  cartItems => cartItems
);

/**
 * Selects the cartItem of the given Id.
 * @param {Object} state The current state.
 * @param {string} params.cartItemId Id of the cartItem.
 * @return {Array} The cart items.
 */
export const getCartItemById = createSelector(
  (state, { cartItemId }) => cartItemId,
  getCartItems,
  (cartItemId, cartItems) => cartItems.find(({ id }) => id === cartItemId) || null
);

/**
 * Selects the products from the cart.
 * @param {Object} state The current state.
 * @return {Object[]} The cart products.
 */
export const getCartProducts = createSelector(
  cartItemsSelector,
  cartItems => cartItems.filter(item => item.type === CART_ITEM_TYPE_PRODUCT)
);

/**
 * Selects the coupons from the cart.
 * @param {Object} state The current state.
 * @return {Array} The cart coupons.
 */
export const getCartCoupons = createSelector(
  cartItemsSelector,
  cartItems => cartItems.filter(item => item.type === CART_ITEM_TYPE_COUPON)
);

/**
 * Calculates the current number of product in the cart.
 * @param {Object} state The current state.
 * @return {number} The current number of products within the cart.
 */
export const getCartProductCount = createSelector(
  cartItemsSelector,
  cartItems => sumBy(
    cartItems,
    cartItem => (cartItem.type === CART_ITEM_TYPE_PRODUCT ? cartItem.quantity : 0)
  ) || 0
);

/**
 * Selects the pending product count from the cart.
 * @param {Object} state The current application state.
 * @return {number}
 */
export const getProductPendingCount = createSelector(
  getCart,
  cart => cart.productPendingCount
);

/**
 * Selects the total, theoretical, number of products in the cart.
 * @param {Object} state The current application state.
 * @return {number}
 */
export const getCartProductDisplayCount = createSelector(
  getCartProductCount,
  getProductPendingCount,
  (productCount, pendingCount) => productCount + pendingCount
);

/**
 * Selects the orderable status from the cart data.
 * @param {Object} state The current application state.
 * @return {boolean}
 */
export const getOrderableStatus = createSelector(
  getCart,
  cart => cart.isOrderable
);

/**
 * Selects the currency from the cart data.
 * @param {Object} state The current application state.
 * @return {string}
 */
export const getCurrency = createSelector(
  getCart,
  cart => cart.currency
);

/**
 * Selects the sub total.
 * @param {Object} state The current application state.
 * @return {string}
 */
export const getSubTotal = createSelector(
  getTotals,
  (totals) => {
    const { amount = 0 } = totals.find(total => total.type === CART_TOTALS_TYPE_SUB) || {};
    return amount;
  }
);

/**
 * Selects the grand total.
 * @param {Object} state The current application state.
 * @returns {number}
 */
export const getGrandTotal = createSelector(
  getTotals,
  (totals) => {
    const { amount = 0 } = totals.find(total => total.type === CART_TOTALS_TYPE_GRAND) || {};
    return amount;
  }
);

/**
 * Selects the shipping costs.
 * @returns {Object|null}
 */
export const getShippingCost = createSelector(
  getTotals,
  totals => totals.find(total => total.type === CART_TOTALS_TYPE_SHIPPING) || null
);

/**
 * Selects the summed up shipping costs of the cart.
 * @returns {number}
 */
export const getShippingCosts = createSelector(
  getShippingCost,
  (shippingCost) => {
    if (!shippingCost) {
      return null;
    }
    const { amount = 0 } = shippingCost;
    return amount;
  }
);

/**
 * Selects the tax value of the cart.
 * @returns {Object}
 */
export const getTax = createSelector(
  getTotals,
  totals => totals.find(total => total.type === CART_TOTALS_TYPE_TAX) || null
);

/**
 * Selects applied discounts from the total amounts stack.
 * @param {Object} state The current application state.
 * @return {Object[]|null}
 */
export const getDiscounts = createSelector(
  getTotals,
  (totals) => {
    const discounts = totals.filter(total => total.type === CART_TOTALS_TYPE_DISCOUNT);
    return discounts.length ? discounts : null;
  }
);

/**
 * Selects the discounts value of the cart.
 * @returns {number}
 */
export const getDiscountsAmount = createSelector(
  getDiscounts,
  (discounts) => {
    if (!discounts) {
      return 0;
    }
    return discounts.reduce((acc, d) => acc + d.amount, 0);
  }
);

/**
 * Selects the received messages from the cart.
 * @param {Object} state The current application state.
 * @return {Array}
 */
export const getCartMessages = createSelector(
  getCart,
  cart => cart.messages
);

/**
 * Selects the cart flags from the cart data.
 * @return {Object}
 */
export const getFlags = createSelector(
  getCart,
  ({ flags }) => flags || {}
);

/**
 * Builds the data for the 'options' property of addProductsToCart pipeline request payload.
 * @param {Object} state The application state.
 * @returns {Object|null} The data if it was determinable, otherwise NULL.
 */
export const getAddToCartOptions = createSelector(
  hasProductOptions,
  areProductOptionsSet,
  getRawProductOptions,
  (state, props) => props.options,
  (hasOptions, areOptionsSet, options, currentOptions) => {
    // Check if options are ready to be added to a pipeline request.
    if (!hasOptions || !areOptionsSet) {
      return null;
    }

    // Create the data structure.
    return Object.keys(currentOptions).map((id) => {
      const value = currentOptions[id];
      const { type } = options.find(option => option.id === id);

      return {
        type,
        id,
        value,
      };
    });
  }
);

/**
 * Builds the data for the 'metadata' property of addProductsToCart pipeline request payload.
 * @returns {Object|null} The data if it was determinable, otherwise NULL.
 */
export const getAddToCartMetadata = createSelector(
  getSelectedVariantMetadata,
  getBaseProductMetadata,
  (variantMetadata, baseProductMetadata) => variantMetadata || baseProductMetadata || null
);

/**
 * Checks if the cart supports redemption of coupons.
 * @return {boolean}
 */
export const hasCouponSupport = createSelector(
  getFlags,
  ({ coupons }) => (typeof coupons === 'boolean' ? coupons : true)
);

/**
 * Checks if the cart is fetching
 * @return {boolean}
 */
export const getIsFetching = createSelector(
  getCart,
  ({ isFetching }) => isFetching || false
);
