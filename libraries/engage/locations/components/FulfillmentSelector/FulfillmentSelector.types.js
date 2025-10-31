/* eslint-disable max-len */
/** @typedef {import('../../locations.types').Location} Location */
/** @typedef {import('../../locations.types').UserLocationFulfillmentMethod} UserLocationFulfillmentMethod */

/**
 * @typedef {(
 *   typeof import('../../constants').DIRECT_SHIP |
 *   typeof import('../../constants').ROPIS |
 *   typeof import('../../constants').BOPIS |
 *   null
 * )} Selection
 */

/**
 * @typedef {Object} UserSearch
 * @property {null} geolocation
 * @property {null} postalCode
 */

/**
 * @typedef {Object} FulfillmentSelectorContextProps
 * @property {Selection} selection
 * @property {Location|null} selectedLocation
 * @property {Location|null} [location]
 * @property {boolean} isDirectShipEnabled
 * @property {boolean} isROPISEnabled
 * @property {boolean} isBOPISEnabled
 * @property {boolean} isReady
 * @property {string} productId
 * @property {function(Selection, boolean): void} handleChange
 * @property {any} conditioner
 * @property {string[]} fulfillmentPaths
 * @property {Object} merchantSettings
 * @property {string|null} userFulfillmentMethod
 * @property {boolean} isOrderable
 * @property {string[]|null} [shopFulfillmentMethods]
 * @property {string[]|null} productFulfillmentMethods
 * @property {string[]|null} locationFulfillmentMethods
 * @property {boolean} useLocationFulfillmentMethods
 * @property {Object} [inventory]
 * @property {Object} [preferredLocation]
 */

/**
 * @typedef {Object} OwnProps
 * @property {any} conditioner
 * @property {string} productId
 */

/**
 * @typedef {Object} StateProps
 * @property {Object} [merchantSettings]
 * @property {string[]|null} [shopFulfillmentMethods]
 * @property {string[]|null} productFulfillmentMethods
 * @property {string[]|null} locationFulfillmentMethods
 * @property {boolean} useLocationFulfillmentMethods
 * @property {boolean} isDirectShipEnabled
 * @property {boolean} isROPISEnabled
 * @property {boolean} isBOPISEnabled
 * @property {Location|null} preferredLocation
 * @property {Object} inventory
 * @property {string|null} userFulfillmentMethod
 * @property {string[]} fulfillmentPaths
 * @property {boolean} isOrderable
 * @property {boolean} isReady
 */

/**
 * @typedef {Object} DispatchProps
 * @property {function(UserLocationFulfillmentMethod): void} storeFulfillmentMethod
 */
/* eslint-enable max-len */
