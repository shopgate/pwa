/**
 * @typedef {import('../../cart.types').ItemFulfillment} ItemFulfillment
 */
/**
 * @typedef {import('@shopgate/engage/product/product.types').Product} Product
 */

/**
 * @typedef {Object} CartItemProduct
 * @property {string} id
 * @property {Product} product
 * @property {number} quantity
 * @property {any[]} messages
 * @property {ItemFulfillment} [fulfillment]
 */

/**
 * @typedef {Object} OwnProps
 * @property {CartItemProduct} cartItem
 * @property {(isEnabled: boolean) => void} [onToggleFocus]
 * @property {boolean} [isEditable]
 * @property {React.ReactNode} [children]
 * @property {string} [currencyOverride]
 */

/**
 * @typedef {Object} StateProps
 * @property {boolean} [isAndroid]
 * @property {string} [currency]
 */

/**
 * @typedef {Object} DispatchProps
 * @property {(cartItemId: string) => Promise<any>} [deleteProduct]
 * @property {(cartItemId: string, quantity: number) => Promise<any>} [updateProduct]
 */
