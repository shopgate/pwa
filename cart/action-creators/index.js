import {
  ADD_PRODUCTS_TO_CART,
  SUCCESS_ADD_PRODUCTS_TO_CART,
  ERROR_ADD_PRODUCTS_TO_CART,
  DELETE_PRODUCTS_FROM_CART,
  SUCCESS_DELETE_PRODUCTS_FROM_CART,
  ERROR_DELETE_PRODUCTS_FROM_CART,
  UPDATE_PRODUCTS_IN_CART,
  SUCCESS_UPDATE_PRODUCTS_IN_CART,
  ERROR_UPDATE_PRODUCTS_IN_CART,
  ADD_COUPONS_TO_CART,
  SUCCESS_ADD_COUPONS_TO_CART,
  ERROR_ADD_COUPONS_TO_CART,
  DELETE_COUPONS_FROM_CART,
  ERROR_DELETE_COUPONS_FROM_CART,
  REQUEST_CART,
  RECEIVE_CART,
  ERROR_CART,
  SET_CART_PENDING_PRODUCT_COUNT,
  SUCCESS_DELETE_COUPONS_FROM_CART,
} from '../constants';

/**
 * Creates the dispatched ADD_PRODUCTS_TO_CART action object.
 * @param {Array} products The products to be added.
 * @returns {Object} The dispatched action object.
 */
export const addProductsToCart = products => ({
  type: ADD_PRODUCTS_TO_CART,
  products,
});

/**
 * Creates the dispatched SUCCESS_ADD_PRODUCTS_TO_CART action object.
 * @returns {Object} The dispatched action object.
 */
export const successAddProductsToCart = () => ({
  type: SUCCESS_ADD_PRODUCTS_TO_CART,
});

/**
 * Creates the dispatched ERROR_ADD_PRODUCTS_TO_CART action object.
 * @param {Array} products The products that where supposed to be added within
 *   an ADD_PRODUCTS_TO_CART action.
 * @param {Array} [errors] A list of errors messages for the products.
 * @returns {Object} The dispatched action object.
 */
export const errorAddProductsToCart = (products, errors = []) => ({
  type: ERROR_ADD_PRODUCTS_TO_CART,
  products,
  errors,
});

/**
 * Creates the dispatched DELETE_PRODUCTS_FROM_CART action object.
 * @param {Array} cartItemIds The cart items to be deleted.
 * @returns {Object} The dispatched action object.
 */
export const deleteProductsFromCart = cartItemIds => ({
  type: DELETE_PRODUCTS_FROM_CART,
  cartItemIds,
});

/**
 * Creates the dispatched SUCCESS_DELETE_PRODUCTS_FROM_CART action object.
 * @returns {Object} The dispatched action object.
 */
export const successDeleteProductsFromCart = () => ({
  type: SUCCESS_DELETE_PRODUCTS_FROM_CART,
});

/**
 * Creates the dispatched ERROR_DELETE_PRODUCTS_FROM_CART action object.
 * @param {Array} products The products that where supposed to be deleted within
 *   an DELETE_PRODUCTS_FROM_CART action.
 * @param {Array} [errors] A list of errors messages for the products.
 * @returns {Object} The dispatched action object.
 */
export const errorDeleteProductsFromCart = (products, errors = []) => ({
  type: ERROR_DELETE_PRODUCTS_FROM_CART,
  products,
  errors,
});

/**
 * Creates the dispatched UPDATE_PRODUCTS_IN_CART action object.
 * @param {Array} updateData The update data.
 * @returns {Object} The dispatched action object.
 */
export const updateProductsInCart = updateData => ({
  type: UPDATE_PRODUCTS_IN_CART,
  updateData,
});

/**
 * Creates the dispatched SUCCESS_UPDATE_PRODUCTS_IN_CART action object.
 * @returns {Object} The dispatched action object.
 */
export const successUpdateProductsInCart = () => ({
  type: SUCCESS_UPDATE_PRODUCTS_IN_CART,
});

/**
 * Creates the dispatched ERROR_UPDATE_PRODUCTS_IN_CART action object.
 * @param {Array} updateData The update data from the failed UPDATE_PRODUCTS_IN_CART action.
 * @param {Array} [errors] A list of errors messages for the products.
 * @returns {Object} The dispatched action object.
 */
export const errorUpdateProductsInCart = (updateData, errors = []) => ({
  type: ERROR_UPDATE_PRODUCTS_IN_CART,
  updateData,
  errors,
});

/**
 * Creates the dispatched ADD_COUPONS_TO_CART action object.
 * @param {Array} couponIds The coupon ids.
 * @returns {Object} The dispatched action object.
 */
export const addCouponsToCart = couponIds => ({
  type: ADD_COUPONS_TO_CART,
  couponIds,
});

/**
 * Creates the dispatched SUCCESS_ADD_COUPONS_TO_CART action object.
 * @param {Array} couponsIds The coupon ids from the successful ADD_COUPONS_TO_CART action.
 * @returns {Object} The dispatched action object.
 */
export const successAddCouponsToCart = couponsIds => ({
  type: SUCCESS_ADD_COUPONS_TO_CART,
  couponsIds,
});

/**
 * Creates the dispatched ERROR_ADD_COUPONS_TO_CART action object.
 * @param {Array} couponsIds The coupon ids from the failed ADD_COUPONS_TO_CART action.
 * @param {Array} [errors] A list of errors messages for the coupons.
 * @returns {Object} The dispatched action object.
 */
export const errorAddCouponsToCart = (couponsIds, errors = []) => ({
  type: ERROR_ADD_COUPONS_TO_CART,
  couponsIds,
  errors,
});

/**
 * Creates the dispatched DELETE_COUPONS_FROM_CART action object.
 * @param {Array} couponIds The coupon ids.
 * @returns {Object} The dispatched action object.
 */
export const deleteCouponsFromCart = couponIds => ({
  type: DELETE_COUPONS_FROM_CART,
  couponIds,
});

/**
 * Creates the dispatched ERROR_DELETE_COUPONS_FROM_CART action object.
 * @param {Array} couponsIds The coupon ids from the failed DELETE_COUPONS_FROM_CART action.
 * @param {Array} [errors] A list of errors messages for the coupons.
 * @returns {Object} The dispatched action object.
 */
export const errorDeleteCouponsFromCart = (couponsIds, errors = []) => ({
  type: ERROR_DELETE_COUPONS_FROM_CART,
  couponsIds,
  errors,
});

/**
 * Creates the dispatched REQUEST_CART action object.
 * @return {Object} The REQUEST_CART action.
 */
export const requestCart = () => ({
  type: REQUEST_CART,
});

/**
 * Creates the dispatched RECEIVE_CART action object
 * @param {Object} cart The cart data
 * @return {Object} The RECEIVE_CART action.
 */
export const receiveCart = cart => ({
  type: RECEIVE_CART,
  cart,
});

/**
 * Creates the dispatched ERROR_CART action object.
 * @return {Object} The ERROR_CART action.
 */
export const errorCart = () => ({
  type: ERROR_CART,
});

/**
 * Creates the dispatched SET_CART_PENDING_PRODUCT_COUNT object.
 * @param {number} count The cart product count.
 * @return {Object} The SET_CART_PENDING_PRODUCT_COUNT action.
 */
export const setCartProductPendingCount = count => ({
  type: SET_CART_PENDING_PRODUCT_COUNT,
  count,
});

/**
 * Creates the dispatched SUCCESS_DELETE_COUPONS_FROM_CART action object.
 * @returns {Object} The dispatched action object.
 */
export const successDeleteCouponsFromCart = () => ({
  type: SUCCESS_DELETE_COUPONS_FROM_CART,
});
