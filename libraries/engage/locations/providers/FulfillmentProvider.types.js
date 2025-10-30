/* eslint-disable max-len */
/**
 * @typedef {import('../../product/product.types').Product} Product
 * @typedef {import('../locations.types').Location} Location
 * @typedef {import('../locations.types').ReservationFormValues} ReservationFormValues
 * @typedef {import('../locations.types').ReservationResponse} ReservationResponse
 * @typedef {import('../locations.types').SheetStage} SheetStage
 * @typedef {import('../../cart/cart.types').AddToCartProduct} AddToCartProduct
 * @typedef {import('../../cart/cart.types').Item} Item
 * @typedef {import('../../core/config/config.types').ShopSettings} ShopSettings
 */

/**
 * @typedef {Object} OwnProps
 * @property {React.ReactNode} children
 * @property {boolean} [open]
 * @property {string} [title]
 * @property {boolean} [changeOnly]
 * @property {(location: Location|null, productId: string|null, orderSuccess?: boolean|null) => void} [onClose]
 * @property {Object<string, any>} [meta]
 * @property {SheetStage} [stage]
 * @property {boolean} [updatePreferredLocation]
 * @property {boolean} [restrictMultiLocationOrders]
 * @property {boolean} [isCart]
 * @property {Object[]} [cartProducts]
 * @property {boolean} [fulfillmentSchedulingEnabled]
 * @property {string} [activeFulfillmentSlotLocationCode]
 * @property {Object} [activeFulfillmentSlot]
 */

/**
 * @typedef {Object} StateProps
 * @property {Location[]|null} locations
 * @property {ReservationFormValues|null} userInput
 * @property {string[]} fulfillmentPaths
 * @property {string[]} [fulfillmentMethods]
 * @property {ShopSettings} [shopSettings]
 * @property {any} inventory
 * @extends Product
 */

/**
 * @typedef {Object} DispatchProps
 * @property {function({location: Location}):void} selectLocation
 * @property {function(ReservationFormValues, Product|null):Promise<ReservationResponse>} submitReservation
 * @property {function(ReservationFormValues):void} storeFormInput
 * @property {function(AddToCartProduct[]):void} addProductsToCart
 * @property {function(Item[]):void} updateProductsInCart
 */
/* eslint-enable max-len */

