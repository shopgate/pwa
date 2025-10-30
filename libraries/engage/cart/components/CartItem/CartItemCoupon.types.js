/**
 * @typedef {import('../../../cart/cart.types').Coupon} Coupon
 */

/**
 * @typedef {Object} OwnProps
 * @property {Coupon} coupon The coupon object.
 * @property {string} id The coupon ID.
 * @property {Array<any>} messages The messages associated with the coupon.
 * @property {boolean} [editable] Whether the coupon is editable.
 */

/**
 * @typedef {Object} StateProps
 * @property {string} currency The currency used in the cart.
 */

/**
 * @typedef {Object} DispatchProps
 * @property {(couponCode: string) => Promise<any>} deleteCoupon Function to delete a coupon.
 */
